import { ColumnTable } from "@components/table/types";
import { formatDateTimeShort } from "@utils/date";
import { IAppRelease } from "./interfaces";
import { formatMegabytes } from "./format";
import { ReleaseStatusChips } from "./ReleaseStatusChips";

export const columnsAppRelease: ColumnTable<IAppRelease>[] = [
  {
    key: "versionName",
    title: "Versi",
    render: (item) => (
      <span className="font-mono text-sm font-semibold">
        {item.versionName} <span className="text-muted">({item.versionCode})</span>
      </span>
    ),
  },
  { key: "isPublished", title: "Status", render: (item) => <ReleaseStatusChips release={item} /> },
  { key: "sizeBytes", title: "Ukuran", render: (item) => formatMegabytes(item.sizeBytes) },
  { key: "uploadedBy", title: "Diunggah oleh", render: (item) => item.uploadedBy || "-" },
  { key: "createdAt", title: "Tanggal", render: (item) => formatDateTimeShort(item.createdAt) },
];
