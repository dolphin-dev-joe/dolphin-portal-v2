export interface IPosService {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  price: string;
  unit: string;
  duration?: string | null;
  durationHours: string;
  notes?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | Date;
}
