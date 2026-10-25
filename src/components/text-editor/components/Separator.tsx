import { memo } from "react";

function SeparatorComponent() {
  return <div className="w-px h-6 bg-border mx-1 shrink-0" />;
}

export const Separator = memo(SeparatorComponent);
