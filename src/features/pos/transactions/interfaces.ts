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
  paymentMethod: string;
  estimatedCompletionAt?: string | null;
  subtotal: string;
  total: string;
  status: string;
  createdAt: string;
  items?: IPosTransactionItem[];
}
