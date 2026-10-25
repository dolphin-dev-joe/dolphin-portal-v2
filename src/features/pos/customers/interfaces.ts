export interface IPosCustomer {
  id: string;
  name: string;
  phone?: string | null;
  address?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | Date;
}
