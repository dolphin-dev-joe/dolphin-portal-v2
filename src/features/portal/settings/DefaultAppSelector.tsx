import { cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import { useAppSwitcher } from "@/contexts/AppSwitcherContext";
import { APPS } from "@/config/apps";

export const DefaultAppSelector = () => {
  const { defaultApp, setDefaultApp } = useAppSwitcher();

  return (
    <div className="space-y-4">
      <div>
        <Heading as="h4" size="base" weight="semibold">
          Aplikasi Default
        </Heading>
        <Text size="sm" color="muted" className="mt-1">
          Pilih aplikasi yang terbuka otomatis saat Anda masuk.
        </Text>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {APPS.map((app) => {
          const isSelected = defaultApp === app.key;
          return (
            <button
              key={app.key}
              type="button"
              onClick={() => setDefaultApp(app.key)}
              aria-pressed={isSelected}
              className={cn(
                "group relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all duration-150",
                isSelected
                  ? "border-accent bg-accent/10 ring-1 ring-inset ring-accent/30"
                  : "border-divider/60 bg-surface/40 hover:border-accent/40 hover:bg-default-100/70",
              )}
            >
              {isSelected && (
                <Icon
                  icon="lucide:check-circle"
                  className="absolute right-3 top-3 h-4 w-4 text-accent"
                />
              )}
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg",
                  isSelected
                    ? "bg-accent/20 text-accent"
                    : "bg-default-100 text-muted-foreground",
                )}
              >
                <Icon icon={app.icon} className="h-5 w-5" />
              </span>
              <div>
                <Text size="sm" weight="semibold">
                  {app.label}
                </Text>
                <Text size="xs" color="muted" className="block">
                  {app.description}
                </Text>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
