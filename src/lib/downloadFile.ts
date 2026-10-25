/**
 * Saves a file from a public URL (e.g. a Supabase Storage image) to the
 * user's device. Falls back to opening it in a new tab when the server does
 * not allow cross-origin downloads.
 */
export async function downloadFile(url: string, fileName: string): Promise<void> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(url, "_blank", "noopener");
  }
}

/** File extension from a URL path, e.g. "png". */
export function extensionOf(url: string, fallback = "jpg"): string {
  const match = /\.([a-z0-9]{2,5})(?:$|[?#])/i.exec(url);
  return match?.[1]?.toLowerCase() ?? fallback;
}
