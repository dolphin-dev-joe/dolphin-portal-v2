import {
  Avatar,
  Dropdown,
  Label,
  Description,
  Header,
  Separator,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { useNavigate } from "react-router";
import { useAppSwitcher } from "@/contexts/AppSwitcherContext";
import { APPS, type AppConfig } from "@/config/apps";
import type { AuthUser } from "@lib/authStorage";

function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export const HeaderUserProfile = () => {
  const { data: identity } = useGetIdentity<AuthUser>();
  const { mutate: logout } = useLogout();
  const { activeApp, setActiveApp } = useAppSwitcher();
  const navigate = useNavigate();

  const user = {
    name: identity?.name ?? "User",
    email: identity?.email || identity?.username || "",
    image: identity?.image ?? null,
  };

  const handleSwitch = (app: AppConfig) => {
    setActiveApp(app.key);
    navigate(app.defaultPath);
  };

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Avatar
          size="md"
          className="cursor-pointer ring-2 ring-secondary/30 transition-transform hover:scale-105"
        >
          <Avatar.Image
            src={user.image ?? undefined}
            alt={user.name ?? "User"}
          />
          <Avatar.Fallback className="bg-secondary/10 text-secondary text-xs font-semibold">
            {getInitials(user.name)}
          </Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>

      <Dropdown.Popover placement="bottom end" className="min-w-64">
        <Dropdown.Menu aria-label="User actions">
          {/* Profile info — read only */}
          <Dropdown.Item
            id="profile"
            textValue={user.name ?? "User"}
            className="cursor-default opacity-100 h-14"
          >
            <Label className="font-semibold text-foreground">
              {user.name ?? "User"}
            </Label>
            <Description className="text-xs text-default-500">
              {user.email}
            </Description>
          </Dropdown.Item>

          <Separator />

          {/* App switcher */}
          <Dropdown.Section>
            <Header className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ganti Aplikasi
            </Header>
            {APPS.map((app) => (
              <Dropdown.Item
                key={app.key}
                id={`app-${app.key}`}
                textValue={app.label}
                onPress={() => handleSwitch(app)}
              >
                <Icon icon={app.icon} className="h-4 w-4 shrink-0" />
                <div className="flex flex-col">
                  <Label className="cursor-pointer">{app.label}</Label>
                  <Description className="text-xs text-default-500">
                    {app.description}
                  </Description>
                </div>
                {activeApp === app.key && (
                  <Icon
                    icon="lucide:check"
                    className="ml-auto h-4 w-4 shrink-0 text-accent"
                  />
                )}
              </Dropdown.Item>
            ))}
          </Dropdown.Section>

          <Separator />

          {/* Settings */}
          <Dropdown.Item id="settings" textValue="My Settings" href="/settings">
            <Icon icon="lucide:settings" className="w-4 h-4" />
            <Label>My Settings</Label>
          </Dropdown.Item>

          {/* Logout */}
          <Dropdown.Item
            id="logout"
            textValue="Log Out"
            variant="danger"
            onPress={() => logout()}
          >
            <Icon icon="lucide:log-out" className="w-4 h-4" />
            <Label>Log Out</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
