import React, { useState, useEffect } from "react";
import { Button, Chip, Typography, Tooltip, cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import { HeaderUserProfile } from "./HeaderUserProfile";
import { useSidebar } from "@contexts/SidebarContext";
import { useAppSwitcher } from "@contexts/AppSwitcherContext";
import { getAppConfig } from "@/config/apps";

export function Header() {
  const [isDark, setIsDark] = useState(false);
  const { toggleSidebar, toggleCollapsed } = useSidebar();
  const { activeApp } = useAppSwitcher();
  const activeConfig = getAppConfig(activeApp);

  useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(html.classList.contains("dark"));
    });
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full shrink-0 items-center justify-between gap-2 border-b border-divider/60 bg-surface/70 px-4 shadow-sm backdrop-blur-xl">
      {/* Left */}
      <div className="flex items-center gap-2.5">
        {/* Mobile: open drawer */}
        <Button
          isIconOnly
          variant="ghost"
          onPress={toggleSidebar}
          className="lg:hidden text-muted-foreground hover:text-foreground"
          aria-label="Toggle sidebar"
        >
          <Icon icon="lucide:menu" className="h-5 w-5" />
        </Button>

        {/* Desktop: collapse/expand rail */}
        <Button
          isIconOnly
          variant="ghost"
          onPress={toggleCollapsed}
          className="hidden lg:flex text-muted-foreground hover:text-foreground hover:bg-default-100/70"
          aria-label="Toggle sidebar collapse"
        >
          <Icon icon="lucide:panel-left" className="h-5 w-5" />
        </Button>

        {/* Branding */}
        <div className="ml-1 hidden flex-col sm:flex">
          <Typography type="body-sm" className="font-semibold leading-tight">
            Admin Dashboard
          </Typography>
          <Typography type="body-xs" color="muted" className="leading-tight">
            Welcome back
          </Typography>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Active app indicator */}
        <Chip color="accent" variant="soft" size="sm">
          <Icon icon={activeConfig.icon} className="h-3.5 w-3.5 shrink-0" />
          <Chip.Label>{activeConfig.label}</Chip.Label>
        </Chip>

        {/* Divider */}
        <span className="mx-1 hidden h-7 w-px bg-divider/60 sm:block" />

        {/* Theme toggle */}
        <Tooltip>
          <Tooltip.Trigger>
            <Button
              isIconOnly
              variant="ghost"
              onPress={toggleTheme}
              className={cn(
                "rounded-xl border border-divider/60 bg-surface/40",
                "text-muted-foreground hover:text-foreground hover:bg-default-100/70",
              )}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Icon icon="lucide:moon" className="h-5 w-5 text-blue-400" />
              ) : (
                <Icon icon="lucide:sun" className="h-5 w-5 text-yellow-400" />
              )}
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content placement="bottom">
            {isDark ? "Switch to light" : "Switch to dark"}
          </Tooltip.Content>
        </Tooltip>

        {/* Divider */}
        <span className="mx-1 hidden h-7 w-px bg-divider/60 sm:block" />

        {/* User dropdown */}
        <HeaderUserProfile />
      </div>
    </header>
  );
}
