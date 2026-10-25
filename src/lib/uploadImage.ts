import { axiosInstance } from "@providers/axios";

interface UploadResponse {
  success: boolean;
  fileUrl: string;
  error?: string;
}

/**
 * Uploads an image to the API's `/articles/upload` endpoint
 * (Supabase Storage-backed) and returns its public URL. Shared by the
 * cover image input and the rich-text editor's inline image button.
 */
export async function uploadImage(file: File, folder = "articles"): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);

  // Let the browser set the multipart boundary.
  const { data } = await axiosInstance.post<UploadResponse>("/articles/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!data.success || !data.fileUrl) {
    throw new Error(data.error ?? "Failed to upload image");
  }
  return data.fileUrl;
}
