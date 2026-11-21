export interface IPosTransactionItem {
  id: string;
  transactionId: string;
  serviceId?: string | null;
  serviceName: string;
  price: string;
  quantity: string;
  note?: string | null;
  createdAt: string;
}

export interface IPosTransaction {
  id: string;
  invoiceNumber: string;
  customerId?: string | null;
  customerName: string;
  cashierId?: string | null;
  cashierName: string;
  perfumeId?: string | null;
  perfumeName?: string | null;
  paymentMethod: string | null; // null while unpaid
  paymentStatus: "paid" | "unpaid";
  paidAt?: string | null;
  estimatedCompletionAt?: string | null;
  subtotal: string;
  total: string;
  status: string;
  createdAt: string;
  // QRIS / transfer proof photo in the private bucket; null until synced.
  paymentProofPath?: string | null;
  // Current phone of the customer (not a snapshot); null without a customer.
  customerPhone?: string | null;
  // When the order last became ready (set by the database).
  readyAt?: string | null;
  // Last WhatsApp reminder opened from the portal, and how many so far.
  remindedAt?: string | null;
  reminderCount?: number;
  // Pickup (jemput) / delivery (antar) charges, included in total; null =
  // none. Paid with the order, or on its own (on the POS) when added after
  // the order was paid. *ProofPath = QRIS/transfer photo of that own payment.
  pickupFee?: string | null;
  pickupFeePaidAt?: string | null;
  pickupFeeMethod?: string | null;
  pickupFeeProofPath?: string | null;
  deliveryFee?: string | null;
  deliveryFeePaidAt?: string | null;
  deliveryFeeMethod?: string | null;
  deliveryFeeProofPath?: string | null;
  courierAddress?: string | null;
  courierNote?: string | null;
  items?: IPosTransactionItem[];
}

export type CourierFeeKind = "pickup" | "delivery";

export interface CourierCharge {
  kind: CourierFeeKind;
  label: string;
  amount: number;
  paidAt: string | null;
  method: string | null;
  proofPath: string | null;
}

/** The order's courier charges, in route order (pickup, then delivery). */
export function courierChargesOf(tx: IPosTransaction): CourierCharge[] {
  const charges: CourierCharge[] = [];
  if (tx.pickupFee != null) {
    charges.push({
      kind: "pickup",
      label: "Jemput",
      amount: Number(tx.pickupFee),
      paidAt: tx.pickupFeePaidAt ?? null,
      method: tx.pickupFeeMethod ?? null,
      proofPath: tx.pickupFeeProofPath ?? null,
    });
  }
  if (tx.deliveryFee != null) {
    charges.push({
      kind: "delivery",
      label: "Antar",
      amount: Number(tx.deliveryFee),
      paidAt: tx.deliveryFeePaidAt ?? null,
      method: tx.deliveryFeeMethod ?? null,
      proofPath: tx.deliveryFeeProofPath ?? null,
    });
  }
  return charges;
}

// Short-lived signed link to a proof photo.
export interface IPaymentProofLink {
  url: string;
  expiresAt: string;
}
