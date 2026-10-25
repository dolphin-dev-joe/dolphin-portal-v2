export interface IPricing {
  id: string;
  categoryId: string;
  categoryName?: string | null;
  name: string;
  nameEn?: string | null;
  price: string | number; // numeric type in drizzle returns string usually
  unit: string;
  unitEn?: string | null;
  durationText?: string | null;
  durationTextEn?: string | null;
  notes?: string | null;
  notesEn?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}
