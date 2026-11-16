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
  items?: IPosTransactionItem[];
}

// Short-lived signed link to a proof photo.
export interface IPaymentProofLink {
  url: string;
  expiresAt: string;
}
