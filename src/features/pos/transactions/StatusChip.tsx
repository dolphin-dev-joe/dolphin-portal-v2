import { Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { STATUS_CONFIG, FALLBACK_STATUS } from "./config";

interface StatusChipProps {
  status: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function StatusChip({ status, size = "md", showIcon = true }: StatusChipProps) {
  const cfg = STATUS_CONFIG[status] ?? { ...FALLBACK_STATUS, label: status };
  return (
    <Chip color={cfg.color} variant="soft" size={size}>
      {showIcon && <Icon icon={cfg.icon} width={14} />}
      <Chip.Label>{cfg.label}</Chip.Label>
    </Chip>
  );
}
