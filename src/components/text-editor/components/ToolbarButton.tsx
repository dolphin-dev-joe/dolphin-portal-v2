import { memo } from "react";
import { Icon } from "@iconify/react";

interface ToolbarButtonProps {
  icon: string;
  label: string;
  command: string;
  cmdValue?: string;
  onCommand: (command: string, cmdValue?: string) => void;
  isDisabled?: boolean;
  isActive?: boolean;
}

function ToolbarButtonComponent({
  icon,
  label,
  command,
  cmdValue,
  onCommand,
  isDisabled = false,
  isActive = false,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      onMouseDown={(e) => {
        e.preventDefault();
        if (!isDisabled) onCommand(command, cmdValue);
      }}
      className={`p-1.5 transition-colors shrink-0 cursor-pointer rounded-md
        ${isActive ? "bg-default-200 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-default-100 active:bg-default-200"}
        ${isDisabled ? "opacity-30 cursor-not-allowed" : ""}`}
      title={label}
    >
      <Icon icon={icon} className="text-lg" />
    </button>
  );
}

export const ToolbarButton = memo(ToolbarButtonComponent);
