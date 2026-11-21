// Price of picking laundry up (jemput) or delivering it (antar). Two fixed
// rows managed by the API: only name, price, active and order can change.
export type CourierFeeCode = "pickup" | "delivery";

export interface IPosCourierFee {
  id: string;
  code: CourierFeeCode;
  name: string;
  price: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const COURIER_FEE_LABELS: Record<CourierFeeCode, string> = {
  pickup: "Jemput",
  delivery: "Antar",
};
