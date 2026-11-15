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
