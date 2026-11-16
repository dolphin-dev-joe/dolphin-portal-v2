export interface IAppRelease {
  id: string;
  platform: "android";
  packageName: string;
  versionCode: number;
  versionName: string;
  fileUrl: string;
  sha256: string;
  sizeBytes: number;
  changelog: string;
  isMandatory: boolean;
  isPublished: boolean;
  uploadedBy: string;
  createdAt: string;
}

/** Step 1 of an upload: where the browser PUTs the APK (Supabase signed URL). */
export interface IUploadTarget {
  uploadUrl: string;
  path: string;
}
