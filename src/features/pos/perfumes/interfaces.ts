export interface IPosPerfume {
  id: string;
  categoryId: string | null;
  categoryName?: string | null;
  name: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | Date;
}
