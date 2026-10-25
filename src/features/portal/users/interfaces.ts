export interface IUser {
  id: string;
  name: string;
  email: string | null;
  username: string | null;
  role: string;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

export const USER_ROLE_OPTIONS = [
  { label: "User", value: "user" },
  { label: "Admin", value: "admin" },
  { label: "Super Admin", value: "super_admin" },
  { label: "Kasir (POS only)", value: "kasir" },
];

export const userRoleLabel = (role: string) =>
  USER_ROLE_OPTIONS.find((r) => r.value === role)?.label ?? role;
