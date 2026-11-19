import type { IAppRelease } from "./interfaces";

/**
 * Public link anyone can open to download this APK, no login needed.
 * `?download=` makes Supabase Storage send it as an attachment with a readable
 * file name, so tapping the link starts the download instead of opening it.
 */
export function shareableDownloadUrl(release: Pick<IAppRelease, "fileUrl" | "versionName">) {
  try {
    const url = new URL(release.fileUrl);
    url.searchParams.set("download", `dolphin-pos-${release.versionName}.apk`);
    return url.toString();
  } catch {
    return release.fileUrl;
  }
}

/** "24,3 MB" */
export function formatMegabytes(bytes: number) {
  return `${(bytes / (1024 * 1024)).toLocaleString("id-ID", { maximumFractionDigits: 1 })} MB`;
}
