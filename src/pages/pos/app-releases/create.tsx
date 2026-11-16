import { useRef, useState } from "react";
import axios, { type AxiosError } from "axios";
import { useInvalidate, useNavigation, useNotification, type HttpError } from "@refinedev/core";
import {
  Button,
  Card,
  Description,
  Label,
  ProgressBar,
  Switch,
  TextArea,
  TextField,
  Typography,
  cn,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { axiosInstance } from "@providers/axios";
import { IAppRelease, IUploadTarget } from "@features/pos/app-releases/interfaces";
import { formatMegabytes } from "@features/pos/app-releases/format";

const MAX_CHANGELOG = 2000;
const APK_CONTENT_TYPE = "application/vnd.android.package-archive";

/** Error body of Supabase Storage (statusCode is a string, e.g. "413"). */
interface StorageError {
  statusCode?: string;
  message?: string;
}

function storageErrorMessage(e: AxiosError<StorageError>): string {
  const code = e.response?.data?.statusCode ?? String(e.response?.status ?? "");
  if (code === "413") {
    return "APK terlalu besar untuk Supabase Storage (free plan maks. 50 MB per file).";
  }
  if (!e.response) return "Koneksi terputus saat mengunggah APK. Coba lagi.";
  return `Upload ke storage gagal: ${e.response.data?.message ?? e.message}`;
}

// Upload a signed release APK. The API reads the version from the APK
// itself, refuses anything that is not the POS app or not newer than the
// last upload, and publishes it to the tablets right away.
export default function PosAppReleaseCreatePage() {
  const { show, list } = useNavigation();
  const { open } = useNotification();
  const invalidate = useInvalidate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [changelog, setChangelog] = useState("");
  const [isMandatory, setIsMandatory] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isUploading = progress !== null;

  const pickFile = (picked: File | undefined) => {
    setError(null);
    if (!picked) return;
    if (!picked.name.toLowerCase().endsWith(".apk")) {
      setError("Pilih file .apk hasil `flutter build apk --release`.");
      return;
    }
    setFile(picked);
  };

  const handleSubmit = async () => {
    if (!file || isUploading) return;
    setError(null);
    setProgress(0);

    try {
      // The API host (Vercel) rejects bodies over 4.5 MB, so the APK goes
      // straight to storage through a signed URL, then the API checks it.
      const { data: target } = await axiosInstance.post<{ data: IUploadTarget }>(
        "/pos/app-releases/upload-url",
      );
      try {
        // Plain axios: the signed URL is the credential, our bearer token must not be sent.
        await axios.put(target.data.uploadUrl, file, {
          headers: { "Content-Type": APK_CONTENT_TYPE },
          timeout: 10 * 60 * 1000,
          onUploadProgress: (e) => setProgress(e.total ? Math.round((e.loaded / e.total) * 100) : 0),
        });
      } catch (e) {
        throw { message: storageErrorMessage(e as AxiosError<StorageError>) } satisfies Partial<HttpError>;
      }

      const { data } = await axiosInstance.post<{ data: IAppRelease }>(
        "/pos/app-releases",
        { path: target.data.path, changelog: changelog.trim(), isMandatory },
        { timeout: 5 * 60 * 1000 },
      );
      open?.({
        type: "success",
        message: `Versi ${data.data.versionName} dipublikasikan`,
        description: "Tablet akan menawarkan update saat aplikasi dibuka berikutnya.",
      });
      await invalidate({ resource: "pos-app-releases", invalidates: ["list"] });
      show("pos-app-releases", data.data.id);
    } catch (e) {
      setError((e as HttpError).message ?? "Upload gagal");
      setProgress(null);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Typography type="h4">Upload Rilis Baru</Typography>
        <Typography type="body-sm" color="muted" className="mt-1">
          Naikkan nomor build di <code className="font-mono">pubspec.yaml</code> (mis.{" "}
          <code className="font-mono">version: 1.2.0+7</code>), jalankan{" "}
          <code className="font-mono">flutter build apk --release</code>, lalu upload file{" "}
          <code className="font-mono">app-release.apk</code>.
        </Typography>
      </div>

      <Card>
        <Card.Content className="space-y-5 p-5">
          <div className="space-y-2">
            <Label>File APK</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".apk,application/vnd.android.package-archive"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (!isUploading) pickFile(e.dataTransfer.files?.[0]);
              }}
              className={cn(
                "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-divider bg-surface p-8 text-center transition-colors hover:border-accent",
                file && "border-accent/60",
              )}
            >
              <Icon icon={file ? "mdi:android" : "mdi:upload"} width={36} className={file ? "text-success" : "text-muted"} />
              {file ? (
                <>
                  <span className="font-mono text-sm font-semibold">{file.name}</span>
                  <span className="text-xs text-muted">{formatMegabytes(file.size)} · klik untuk ganti</span>
                </>
              ) : (
                <span className="text-sm text-muted">Klik atau seret file .apk ke sini</span>
              )}
            </button>
          </div>

          <TextField value={changelog} onChange={setChangelog} isDisabled={isUploading} className="w-full">
            <Label>Yang baru (ditampilkan ke kasir)</Label>
            <TextArea
              rows={5}
              maxLength={MAX_CHANGELOG}
              placeholder={"- Tombol cetak nota di Order Aktif\n- Perbaikan sinkronisasi saat offline"}
              className="w-full"
            />
            <Description>
              Tulis singkat dan jelas untuk staf laundry. {changelog.length}/{MAX_CHANGELOG}
            </Description>
          </TextField>

          <Switch isSelected={isMandatory} onChange={setIsMandatory} isDisabled={isUploading}>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Content>
              <Label>Update wajib</Label>
              <Description>
                Tablet dengan versi lebih lama tidak bisa dipakai sampai update. Pakai hanya kalau versi
                lama sudah tidak cocok dengan server.
              </Description>
            </Switch.Content>
          </Switch>

          {isUploading && (
            <ProgressBar value={progress} aria-label="Progres upload">
              <div className="flex justify-between text-sm">
                <Label>{progress < 100 ? "Mengunggah…" : "Memeriksa APK…"}</Label>
                <ProgressBar.Output />
              </div>
              <ProgressBar.Track>
                <ProgressBar.Fill />
              </ProgressBar.Track>
            </ProgressBar>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-danger/10 p-3 text-sm text-danger">
              <Icon icon="mdi:alert-circle-outline" width={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onPress={() => list("pos-app-releases")} isDisabled={isUploading}>
              Batal
            </Button>
            <Button onPress={handleSubmit} isDisabled={!file || isUploading} isPending={isUploading}>
              <Icon icon="mdi:cloud-upload-outline" width={18} />
              Upload & Publikasikan
            </Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
