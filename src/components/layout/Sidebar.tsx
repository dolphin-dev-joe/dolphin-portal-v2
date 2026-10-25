import { useEffect, useMemo, useState } from "react";
import { useCan, useLogout, useMenu } from "@refinedev/core";
import {
  Button,
  cn,
  Typography,
  Tooltip,
  Disclosure,
  Dropdown,
  Header,
  Label,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSidebar } from "@/contexts/SidebarContext";
import { useAppSwitcher } from "@/contexts/AppSwitcherContext";
import { APPS, getAppConfig } from "@/config/apps";
import { Link } from "react-router";
import { usePathname } from "@hooks/usePathname";

// ─── Types ────────────────────────────────────────────────────────────────────

type MenuItem = ReturnType<typeof useMenu>["menuItems"][number];

// Boundary-aware active check — avoids false positives where one route is a
// bare prefix of another (e.g. "/pos/services" vs "/pos/services-x"). A route
// is active when it matches exactly or the pathname continues after a "/".
function isRouteActive(pathname: string, route?: string): boolean {
  if (!route) return false;
  if (route === "/") return pathname === "/";
  return pathname === route || pathname.startsWith(`${route}/`);
}

// Collect all leaf (no-children) descendants of a menu item, flattened.
// Used for the collapsed dropdown so deeply nested items stay reachable.
function collectLeafItems(items: MenuItem[]): MenuItem[] {
  return items.flatMap((item) =>
    item.children && item.children.length > 0
      ? collectLeafItems(item.children)
      : [item],
  );
}

// ─── Single nav item (leaf — no children) ─────────────────────────────────────

function NavItem({
  item,
  isCollapsed,
  depth = 0,
  closeSidebar,
}: {
  item: MenuItem;
  isCollapsed: boolean;
  depth?: number;
  closeSidebar: () => void;
}) {
  const { data } = useCan({ resource: item.name, action: "list" });
  const pathname = usePathname();

  const hasAccess = data?.can ?? false;
  if (!hasAccess) return null;

  const label = item.label ?? item.name;
  const iconName = (item.meta?.icon as string) ?? "mdi:circle-small";

  const isActive = isRouteActive(pathname, item.route);

  const link = (
    <Link
      to={item.route ?? "/"}
      onClick={closeSidebar}
      style={{ paddingLeft: isCollapsed ? undefined : `${12 + depth * 12}px` }}
      className={cn(
        "group relative flex items-center gap-3 overflow-hidden rounded-xl pr-3 py-2 text-sm font-medium transition-all duration-150",
        isCollapsed && "justify-center px-0 w-10 mx-auto",
        isActive
          ? "bg-accent/15 text-accent shadow-sm shadow-accent/10 ring-1 ring-inset ring-accent/15"
          : "text-muted-foreground hover:bg-default-100/70 hover:text-foreground",
      )}
    >
      {isActive && !isCollapsed && (
        <span className="absolute left-1 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-accent to-accent/50" />
      )}
      <Icon
        icon={iconName}
        className={cn(
          "h-5 w-5 shrink-0 transition-transform duration-150",
          !isActive && "group-hover:scale-110",
        )}
      />
      {!isCollapsed && <span className="truncate ">{label}</span>}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <Tooltip.Trigger className="block w-full">{link}</Tooltip.Trigger>
        <Tooltip.Content placement="right">{label}</Tooltip.Content>
      </Tooltip>
    );
  }

  return <>{link}</>;
}

// ─── Parent item with children ────────────────────────────────────────────────

// Renders a single leaf as a Dropdown.Item link (collapsed flyout menu).
function CollapsedLeaf({
  child,
  pathname,
  closeSidebar,
}: {
  child: MenuItem;
  pathname: string;
  closeSidebar: () => void;
}) {
  return (
    <Dropdown.Item
      id={child.key}
      textValue={child.label || child.name}
      render={({ ref, ...props }: any) => (
        <Link
          {...props}
          ref={ref as React.Ref<HTMLAnchorElement>}
          to={child.route || "/"}
          onClick={() => {
            props.onClick?.();
            closeSidebar();
          }}
          className={cn(
            props.className,
            "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
            isRouteActive(pathname, child.route)
              ? "bg-accent/10 text-accent"
              : "hover:bg-default-100",
          )}
        />
      )}
    >
      <Icon
        icon={(child.meta?.icon as string) || "mdi:circle-small"}
        className="h-4 w-4 opacity-70"
      />
      <Label className="flex-1 truncate cursor-pointer">
        {child.label || child.name}
      </Label>
    </Dropdown.Item>
  );
}

function NavGroup({
  item,
  isCollapsed,
  closeSidebar,
  depth = 0,
}: {
  item: MenuItem;
  isCollapsed: boolean;
  closeSidebar: () => void;
  depth?: number;
}) {
  const pathname = usePathname();
  const label = item.label ?? item.name;
  const iconName = (item.meta?.icon as string) ?? "mdi:folder-outline";

  // Each group manages its own expansion independently — no shared accordion
  // state — so nested groups can open without collapsing their parent.
  const isAnyChildActive = collectLeafItems(item.children ?? []).some((child) =>
    isRouteActive(pathname, child.route),
  );
  const [isExpanded, setExpanded] = useState(isAnyChildActive);

  if (isCollapsed) {
    const children = item.children ?? [];
    const directLeaves = children.filter(
      (c) => !(c.children && c.children.length > 0),
    );
    const subGroups = children.filter(
      (c) => c.children && c.children.length > 0,
    );

    return (
      <div>
        <Dropdown>
          <Tooltip>
            <Tooltip.Trigger>
              <Dropdown.Trigger>
                <Button
                  isIconOnly
                  variant="ghost"
                  className={cn(
                    "mx-auto flex w-10 items-center justify-center rounded-xl py-2 outline-none transition-colors",
                    isAnyChildActive
                      ? "bg-accent/15 text-accent ring-1 ring-inset ring-accent/15"
                      : "text-muted-foreground hover:bg-default-100/70 hover:text-foreground",
                  )}
                  aria-label={label}
                >
                  <Icon icon={iconName} className="h-5 w-5 shrink-0" />
                </Button>
              </Dropdown.Trigger>
            </Tooltip.Trigger>
            <Tooltip.Content placement="right">{label}</Tooltip.Content>
          </Tooltip>

          <Dropdown.Popover className="min-w-[200px]">
            <Dropdown.Menu>
              {directLeaves.length > 0 && (
                <Dropdown.Section>
                  <Header className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {label}
                  </Header>
                  {directLeaves.map((child) => (
                    <CollapsedLeaf
                      key={child.key}
                      child={child}
                      pathname={pathname}
                      closeSidebar={closeSidebar}
                    />
                  ))}
                </Dropdown.Section>
              )}
              {subGroups.map((sg) => (
                <Dropdown.Section key={sg.key}>
                  <Header className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {sg.label || sg.name}
                  </Header>
                  {collectLeafItems(sg.children ?? []).map((child) => (
                    <CollapsedLeaf
                      key={child.key}
                      child={child}
                      pathname={pathname}
                      closeSidebar={closeSidebar}
                    />
                  ))}
                </Dropdown.Section>
              ))}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    );
  }

  return (
    <Disclosure isExpanded={isExpanded} onExpandedChange={setExpanded}>
      <Disclosure.Heading>
        <Disclosure.Trigger
          style={{ paddingLeft: `${12 + depth * 12}px` }}
          className={cn(
            "group flex w-full items-center gap-3 rounded-xl pr-3 py-2 text-sm font-medium transition-all duration-150",
            "text-muted-foreground hover:bg-default-100/70 hover:text-foreground data-[expanded=true]:text-accent",
            isAnyChildActive &&
              "bg-accent/10 font-semibold text-accent ring-1 ring-inset ring-accent/15",
          )}
        >
          <Icon icon={iconName} className="h-5 w-5 shrink-0" />
          <span className="flex-1 truncate text-left">{label}</span>
          <Disclosure.Indicator>
            <Icon
              icon="mdi:chevron-down"
              className="h-4 w-4 shrink-0 transition-transform duration-200"
            />
          </Disclosure.Indicator>
        </Disclosure.Trigger>
      </Disclosure.Heading>
      <Disclosure.Content>
        <div className="flex flex-col gap-0.5 mt-0.5 ml-2 border-l border-divider/50 pl-2">
          {item.children?.map((child) =>
            child.children && child.children.length > 0 ? (
              <NavGroup
                key={child.key}
                item={child}
                isCollapsed={false}
                closeSidebar={closeSidebar}
                depth={depth + 1}
              />
            ) : (
              <NavItem
                key={child.key}
                item={child}
                isCollapsed={false}
                depth={depth + 1}
                closeSidebar={closeSidebar}
              />
            ),
          )}
        </div>
      </Disclosure.Content>
    </Disclosure>
  );
}

// ─── Root menu renderer ───────────────────────────────────────────────────────

function MenuList({
  items,
  isCollapsed,
  closeSidebar,
}: {
  items: MenuItem[];
  isCollapsed: boolean;
  closeSidebar: () => void;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {items.map((item) =>
        item.children && item.children.length > 0 ? (
          <NavGroup
            key={item.key}
            item={item}
            isCollapsed={isCollapsed}
            closeSidebar={closeSidebar}
          />
        ) : (
          <NavItem
            key={item.key}
            item={item}
            isCollapsed={isCollapsed}
            closeSidebar={closeSidebar}
          />
        ),
      )}
    </div>
  );
}

// ─── Sidebar root ─────────────────────────────────────────────────────────────

export function Sidebar() {
  const { menuItems } = useMenu();
  const { mutate: logout } = useLogout();
  const { isOpen, isCollapsed, closeSidebar } = useSidebar();
  const { activeApp, setActiveApp } = useAppSwitcher();
  const pathname = usePathname();

  const activeConfig = getAppConfig(activeApp);

  // Standalone Dashboard leaf — always visible, regardless of the active app.
  const dashboardItem = useMemo(
    () => menuItems.find((item) => item.name === "dashboard"),
    [menuItems],
  );

  // The active app's own menu = the children of its root resource group.
  const appItems = useMemo(() => {
    const group = menuItems.find(
      (item) => item.name === activeConfig.rootResource,
    );
    return group?.children ?? [];
  }, [menuItems, activeConfig.rootResource]);

  // Keep the active app in sync with the current URL, so deep-linking or a
  // browser refresh lands you in the correct app section.
  useEffect(() => {
    for (const app of APPS) {
      const group = menuItems.find((item) => item.name === app.rootResource);
      if (!group) continue;
      const belongs = collectLeafItems(group.children ?? []).some(
        (leaf) =>
          leaf.route !== "/" && isRouteActive(pathname, leaf.route),
      );
      if (belongs) {
        if (app.key !== activeApp) setActiveApp(app.key);
        return;
      }
    }
  }, [pathname, menuItems, activeApp, setActiveApp]);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={closeSidebar}
        aria-hidden
      />

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col",
          "border-r border-divider/60 bg-gradient-to-b from-surface to-surface/60 shadow-xl shadow-accent/5 backdrop-blur-xl",
          "transition-[width,transform] duration-200 ease-in-out",
          "lg:translate-x-0",
          isCollapsed ? "lg:w-16" : "lg:w-64",
          "w-60",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Accent glow at top */}
        <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
        {/* Brand */}
        <div
          className={cn(
            "relative z-10 flex h-16 shrink-0 items-center gap-2.5 border-b border-divider/60 px-4",
            isCollapsed ? "justify-center px-2" : "justify-between",
          )}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 ring-1 ring-inset ring-white/30 shadow-md shadow-accent/20">
              <img
                src="/assets/images/dl-logo.png"
                alt="Dolphin"
                width={50}
                height={48}
                className="h-6 w-6 object-contain"
              />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <Typography
                  type="h6"
                  className="leading-none font-bold tracking-tight text-foreground"
                >
                  Dolphin
                </Typography>
                <Typography
                  type="body-xs"
                  color="muted"
                  className="leading-tight"
                >
                  Laundry Portal
                </Typography>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={closeSidebar}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-default-100 hover:text-foreground lg:hidden"
              aria-label="Close sidebar"
            >
              <Icon icon="mdi:close" className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="relative z-10 flex-1 overflow-y-auto px-3 py-4">
          <div className="flex flex-col gap-1">
            {/* Dashboard — always available */}
            {dashboardItem && (
              <MenuList
                items={[dashboardItem]}
                isCollapsed={isCollapsed}
                closeSidebar={closeSidebar}
              />
            )}

            {/* Divider between dashboard and app menu */}
            <div
              className={cn(
                "my-1 flex",
                isCollapsed ? "justify-center" : "px-3",
              )}
            >
              <span
                className={cn(
                  "h-px bg-divider/60",
                  isCollapsed ? "w-6" : "w-full",
                )}
              />
            </div>

            {/* Active app menu */}
            <MenuList
              items={appItems}
              isCollapsed={isCollapsed}
              closeSidebar={closeSidebar}
            />
          </div>
        </nav>

        {/* Sign out */}
        <div className="relative z-10 shrink-0 border-t border-divider/60 px-3 py-3">
          {isCollapsed ? (
            <Tooltip>
              <Tooltip.Trigger className="block w-full">
                <button
                  onClick={() => logout()}
                  className="flex w-full items-center justify-center rounded-lg py-2.5 text-sm font-medium text-danger transition-all duration-150 hover:bg-danger/10"
                  aria-label="Sign out"
                >
                  <Icon icon="mdi:logout" className="h-5 w-5 shrink-0" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Content placement="right">Sign out</Tooltip.Content>
            </Tooltip>
          ) : (
            <Button
              variant="danger"
              onPress={() => logout()}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium"
            >
              <Icon icon="mdi:logout" className="h-5 w-5 shrink-0" />
              <span>Sign out</span>
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
