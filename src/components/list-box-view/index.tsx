import { Description, Label, ListBox, Skeleton, ScrollShadow } from "@heroui/react";
import React from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ListBoxViewItem {
  id: string | number;
  label: string;
  description?: string;
  badge?: string | number;
}

interface ListBoxViewProps {
  items?: ListBoxViewItem[];
  isLoading?: boolean;
  skeletonCount?: number;
  ariaLabel?: string;
  emptyText?: string;
  maxHeight?: string | number;
  className?: string;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function ListBoxViewSkeleton({ count }: { count: number }) {
  return (
    <div className="w-full divide-y divide-default-100">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-start justify-between gap-4 py-3 px-4"
        >
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-4 w-2/5 rounded-md" />
            <Skeleton className="h-3 w-1/3 rounded-md" />
          </div>
          <Skeleton className="h-6 w-16 rounded-md shrink-0" />
        </div>
      ))}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ListBoxView({
  items,
  isLoading = false,
  skeletonCount = 5,
  ariaLabel = "list-box-view",
  emptyText = "No items found.",
  maxHeight,
  className,
}: ListBoxViewProps) {
  const content = React.useMemo(() => {
    if (isLoading) {
      return <ListBoxViewSkeleton count={skeletonCount} />;
    }

    if (!items || items.length === 0) {
      return (
        <div className="p-4 text-center text-default-400 text-sm">
          {emptyText}
        </div>
      );
    }

    return (
      <ListBox aria-label={ariaLabel} className="w-full" selectionMode="none">
        <ListBox.Section>
          {items.map((item) => (
            <ListBox.Item
              key={item.id}
              id={String(item.id)}
              textValue={item.label}
              className="py-3 px-4"
            >
              <div className="flex items-start justify-between gap-4 w-full">
                <div className="flex flex-col gap-0.5">
                  <Label className="font-semibold text-sm">{item.label}</Label>
                  {item.description && (
                    <Description className="text-xs">
                      {item.description}
                    </Description>
                  )}
                </div>

                {item.badge !== undefined && (
                  <span className="shrink-0 text-xs font-mono bg-default-100 px-2 py-1 rounded">
                    {item.badge}
                  </span>
                )}
              </div>
            </ListBox.Item>
          ))}
        </ListBox.Section>
      </ListBox>
    );
  }, [isLoading, skeletonCount, items, emptyText, ariaLabel]);

  return (
    <ScrollShadow
      className={className}
      style={{ maxHeight }}
      isEnabled={!!maxHeight}
    >
      {content}
    </ScrollShadow>
  );
}
