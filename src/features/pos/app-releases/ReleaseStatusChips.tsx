import { Chip } from "@heroui/react";
import { IAppRelease } from "./interfaces";

interface ReleaseStatusChipsProps {
  release: IAppRelease;
  size?: "sm" | "md" | "lg";
}

export function ReleaseStatusChips({ release, size = "sm" }: ReleaseStatusChipsProps) {
  return (
    <div className="flex flex-wrap gap-1">
      <Chip color={release.isPublished ? "success" : "default"} variant="soft" size={size}>
        <Chip.Label>{release.isPublished ? "Dipublikasikan" : "Ditarik"}</Chip.Label>
      </Chip>
      {release.isMandatory && (
        <Chip color="warning" variant="soft" size={size}>
          <Chip.Label>Wajib</Chip.Label>
        </Chip>
      )}
    </div>
  );
}
