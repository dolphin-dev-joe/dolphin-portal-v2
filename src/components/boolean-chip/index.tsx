import { Chip } from "@heroui/react";

interface BooleanChipProps {
  value: boolean;
  trueLabel?: string;
  falseLabel?: string;
}

export const BooleanChip = ({
  value,
  trueLabel = "Active",
  falseLabel = "Inactive",
}: BooleanChipProps) => {
  return (
    <Chip color={value ? "success" : "danger"}>
      {value ? trueLabel : falseLabel}
    </Chip>
  );
};
