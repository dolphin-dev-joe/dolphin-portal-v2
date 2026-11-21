import type { ReactNode } from "react";
import { cn, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";

const TOOLTIP_DELAY = 300;

/** Shows `content` on hover/focus of `children`; renders children alone when there is no content. */
export function HintTooltip({
  content,
  children,
  placement = "top",
  className,
}: {
  content?: ReactNode;
  children: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  className?: string;
}) {
  if (!content) return <>{children}</>;
  return (
    <Tooltip delay={TOOLTIP_DELAY} closeDelay={0}>
      {/* Wrapper keeps the hint working on a disabled button too. */}
      <Tooltip.Trigger className={cn("inline-flex", className)}>
        {children}
      </Tooltip.Trigger>
      <Tooltip.Content
        placement={placement}
        showArrow
        className="max-w-72 text-xs leading-relaxed"
      >
        <Tooltip.Arrow />
        {content}
      </Tooltip.Content>
    </Tooltip>
  );
}

/** Small ⓘ next to a label that explains it. */
export function InfoTooltip({
  content,
  className,
}: {
  content: ReactNode;
  className?: string;
}) {
  return (
    <HintTooltip content={content} className={className}>
      <span
        tabIndex={0}
        aria-label="Info"
        className="inline-flex cursor-help text-muted outline-none hover:text-foreground focus-visible:text-accent"
      >
        <Icon icon="mdi:information-outline" className="h-3.5 w-3.5" />
      </span>
    </HintTooltip>
  );
}

/** Column title with an optional ⓘ hint. */
export function ColumnTitle({
  title,
  tooltip,
}: {
  title: string;
  tooltip?: ReactNode;
}) {
  if (!tooltip) return <>{title}</>;
  return (
    <span className="inline-flex items-center gap-1">
      {title}
      <InfoTooltip content={tooltip} />
    </span>
  );
}
