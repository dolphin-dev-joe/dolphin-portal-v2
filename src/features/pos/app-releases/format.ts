/** "24,3 MB" */
export function formatMegabytes(bytes: number) {
  return `${(bytes / (1024 * 1024)).toLocaleString("id-ID", { maximumFractionDigits: 1 })} MB`;
}
