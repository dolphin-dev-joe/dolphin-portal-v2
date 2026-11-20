import { Card, Link, cn } from "@heroui/react";
import { Text } from "@/components/text";
import type { ReactNode } from "react";
import { Icon } from "@iconify/react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: ReactNode;
  /** Soft tint for the icon tile and the corner glow, e.g. `bg-blue-100 dark:bg-blue-400/10`. */
  bgColor: string;
  /** Matching strong color for the icon and the link, e.g. `text-blue-600 dark:text-blue-400`. */
  textColor: string;
  delay?: number;
  href?: string;
}

/**
 * Responsive grid for stat cards. Columns are driven by the available width
 * (not the viewport), so it adapts whether the sidebar is open or collapsed:
 * 2 columns on phones, then as many ~11rem columns as fit.
 */
export function StatCardGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] md:gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default function StatCard({
  title,
  value,
  change,
  icon,
  bgColor,
  textColor,
  href,
  delay = 0,
}: StatCardProps) {
  return (
    <Card
      className="stat-card-enter relative min-w-0 overflow-hidden"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Corner glow in the card's own color, so each card has its own tint instead of gray */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -end-8 -top-8 size-24 rounded-full opacity-60 blur-2xl ${bgColor}`}
      />

      <Card.Content className="relative flex h-full flex-col gap-2 p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <Text
            size="sm"
            weight="medium"
            muted
            className="line-clamp-2 min-w-0 text-xs sm:text-sm"
          >
            {title}
          </Text>
          <div
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-9 [&_svg]:size-4 sm:[&_svg]:size-5 ${bgColor} ${textColor}`}
          >
            {icon}
          </div>
        </div>

        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
          <span
            title={value}
            className="min-w-0 truncate text-lg font-semibold tabular-nums text-foreground sm:text-xl xl:text-2xl"
          >
            {value}
          </span>
          {change && (
            <span className="rounded-md bg-success/10 px-1.5 py-0.5 text-xs font-medium text-success">
              {change}
            </span>
          )}
        </div>

        {href && (
          <Link
            href={href}
            className={`group mt-auto flex w-fit items-center gap-1 text-xs font-medium no-underline transition-opacity hover:opacity-80 ${textColor}`}
          >
            Lihat detail
            <Icon
              icon="heroicons:arrow-right"
              className="size-3 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        )}
      </Card.Content>
    </Card>
  );
}
