import { memo } from "react";

interface ToolbarSelectProps {
  options: { label: string; value: string }[];
  onCommand: (command: string, cmdValue?: string) => void;
  defaultValue?: string;
  value?: string;
  title: string;
  width?: string;
  command: string;
  isDisabled?: boolean;
}

function ToolbarSelectComponent({
  options,
  onCommand,
  defaultValue = "",
  value,
  title,
  width = "w-24",
  command,
  isDisabled = false,
}: ToolbarSelectProps) {
  const controlled = value !== undefined ? { value } : { defaultValue };
  return (
    <select
      className={`${width} h-8 px-2 text-xs border border-divider rounded-md bg-surface text-foreground focus:outline-none focus:border-accent shrink-0 transition-colors ${isDisabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
      onMouseDown={(e) => e.stopPropagation()}
      onChange={(e) => {
        if (!isDisabled) onCommand(command, e.target.value);
      }}
      disabled={isDisabled}
      {...controlled}
      title={title}
    >
      {options.map((opt) => (
        <option
          key={opt.value}
          value={opt.value}
          className="bg-surface text-foreground font-medium"
        >
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export const ToolbarSelect = memo(ToolbarSelectComponent);
