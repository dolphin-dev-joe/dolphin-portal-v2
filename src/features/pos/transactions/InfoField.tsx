import type { ReactNode } from "react";
import { Typography } from "@heroui/react";

interface InfoFieldProps {
  label: string;
  value: ReactNode;
  className?: string;
}

export function InfoField({ label, value, className }: InfoFieldProps) {
  return (
    <div className={className}>
      <Typography type="body-xs" color="muted" className="mb-0.5">
        {label}
      </Typography>
      <Typography type="body-sm" weight="medium">
        {value}
      </Typography>
    </div>
  );
}
