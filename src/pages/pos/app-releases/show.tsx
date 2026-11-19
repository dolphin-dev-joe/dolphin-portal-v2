import { useState } from "react";
import { useOne, useParsed, useUpdate } from "@refinedev/core";
import {
  Button,
  Card,
  Description,
  EmptyState,
  Label,
  Skeleton,
  Switch,
  TextArea,
  TextField,
  Typography,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { IAppRelease } from "@features/pos/app-releases/interfaces";
import { ReleaseStatusChips } from "@features/pos/app-releases/ReleaseStatusChips";
import { formatMegabytes, shareableDownloadUrl } from "@features/pos/app-releases/format";
import { useCopyToClipboard } from "@hooks/useCopyToClipboard";
import { InfoField } from "@features/pos/transactions/InfoField";
import { formatDateTimeShort } from "@utils/date";

export default function PosAppReleaseShowPage() {
  const { id } = useParsed();
  const { result: release, query } = useOne<IAppRelease>({ resource: "pos-app-releases", id });
  const { mutate: update, mutation } = useUpdate<IAppRelease>();
  const [changelog, setChangelog] = useState<string | null>(null);
  const copy = useCopyToClipboard();

  const patch = (values: Partial<Pick<IAppRelease, "changelog" | "isMandatory" | "isPublished">>, message: string) => {
    if (!id) return;
    update(
      {
        resource: "pos-app-releases",
        id,
        values,
        successNotification: () => ({ message, type: "success" }),
      },
      { onSuccess: () => setChangelog(null) },
    );
  };

  if (query.isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (!release) {
    return (
      <EmptyState className="flex flex-col items-center gap-3 py-16 text-center">
        <Icon icon="mdi:alert-circle-outline" width={40} className="text-danger" />
        <Typography type="body" color="muted">
          Rilis tidak ditemukan.
        </Typography>
      </EmptyState>
    );
  }

  const isSaving = mutation.isPending;
  const downloadUrl = shareableDownloadUrl(release);
  const draft = changelog ?? release.changelog;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Typography type="body-xs" color="muted" className="mb-1 uppercase tracking-wide">
            Dolphin POS · Android
          </Typography>
          <Typography type="h4" className="font-mono">
            {release.versionName} <span className="text-muted">({release.versionCode})</span>
          </Typography>
          <Typography type="body-sm" color="muted" className="mt-0.5">
            {formatDateTimeShort(release.createdAt)} · {release.uploadedBy || "-"}
          </Typography>
        </div>
        <ReleaseStatusChips release={release} size="md" />
      </div>

      <Card>
        <Card.Content className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <InfoField label="Package" value={<span className="font-mono">{release.packageName}</span>} />
          <InfoField label="Ukuran" value={formatMegabytes(release.sizeBytes)} />
          <InfoField
            className="sm:col-span-2"
            label="SHA-256 (dicek tablet sebelum install)"
            value={<span className="break-all font-mono text-xs">{release.sha256}</span>}
          />
          <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
            <Button size="sm" onPress={() => void copy(downloadUrl, "Link download disalin. Kirim ke siapa saja.")}>
              <Icon icon="mdi:link-variant" width={16} />
              Salin link download
            </Button>
            <Button variant="secondary" size="sm" onPress={() => window.open(downloadUrl, "_blank")}>
              <Icon icon="mdi:download" width={16} />
              Unduh APK
            </Button>
            <Typography type="body-xs" color="muted" className="w-full">
              Siapa pun yang punya link ini bisa langsung mengunduh APK, tanpa login.
            </Typography>
          </div>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content className="space-y-5 p-5">
          <Switch
            isSelected={release.isPublished}
            isDisabled={isSaving}
            onChange={(on) =>
              patch({ isPublished: on }, on ? "Rilis dipublikasikan lagi" : "Rilis ditarik dari tablet")
            }
          >
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Content>
              <Label>Dipublikasikan</Label>
              <Description>
                Matikan untuk berhenti menawarkan versi ini. Tablet yang sudah memasangnya tetap memakainya
                (Android tidak bisa turun versi): perbaiki dengan upload versi baru.
              </Description>
            </Switch.Content>
          </Switch>

          <Switch
            isSelected={release.isMandatory}
            isDisabled={isSaving}
            onChange={(on) => patch({ isMandatory: on }, on ? "Update dijadikan wajib" : "Update tidak lagi wajib")}
          >
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Content>
              <Label>Update wajib</Label>
              <Description>Tablet di bawah versi ini diblokir sampai update.</Description>
            </Switch.Content>
          </Switch>

          <TextField value={draft} onChange={setChangelog} isDisabled={isSaving} className="w-full">
            <Label>Yang baru (ditampilkan ke kasir)</Label>
            <TextArea rows={5} maxLength={2000} className="w-full" />
          </TextField>
          <div className="flex justify-end">
            <Button
              size="sm"
              isDisabled={changelog === null || changelog === release.changelog || isSaving}
              isPending={isSaving}
              onPress={() => patch({ changelog: draft }, "Catatan rilis disimpan")}
            >
              Simpan catatan
            </Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
