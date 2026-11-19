import { Card, Link } from "@heroui/react";
import { Heading } from "@/components/heading";
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
      className="stat-card-enter relative overflow-hidden"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Corner glow in the card's own color, so each card has its own tint instead of gray */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -end-10 -top-10 size-36 rounded-full opacity-70 blur-2xl ${bgColor}`}
      />

      <Card.Content className="relative p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className={`rounded-xl p-3 ${bgColor} ${textColor}`}>{icon}</div>
          {change && (
            <span className="rounded-lg bg-success/10 px-2 py-1 text-xs font-medium text-success">
              {change}
            </span>
          )}
        </div>
        <Text size="lg" color="muted" weight="medium" className="mb-1">
          {title}
        </Text>
        <Heading as="h3" size="3xl" weight="bold" className="text-foreground">
          {value}
        </Heading>

        {href && (
          <Link
            href={href}
            className={`group mt-4 flex w-fit items-center gap-1.5 text-sm font-medium no-underline transition-opacity hover:opacity-80 ${textColor}`}
          >
            Lihat detail
            <Icon
              icon="heroicons:arrow-right"
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        )}
      </Card.Content>
    </Card>
  );
}
