// Response of GET /pos/statistics (dolphin-api internal/pos/stats).
// Revenue = money received (by paidAt); orders = transactions created.
// Cancelled transactions only count in `cancelledOrders`.

export type Granularity = "day" | "week" | "month";

export interface StatsSummary {
  revenue: number;
  orders: number;
  orderValue: number;
  averageOrderValue: number;
  cancelledOrders: number;
  newCustomers: number;
}

export interface TrendPoint {
  /** First day of the bucket, YYYY-MM-DD (store time). */
  date: string;
  revenue: number;
  orders: number;
}

export interface PaymentShare {
  method: string;
  revenue: number;
  orders: number;
}

export interface ServiceStat {
  serviceName: string;
  unit: string | null;
  quantity: number;
  revenue: number;
  orders: number;
}

export interface HourCell {
  /** ISO weekday: 1 = Monday … 7 = Sunday. */
  weekday: number;
  hour: number;
  orders: number;
}

export interface PosStatistics {
  range: {
    from: string;
    to: string;
    days: number;
    granularity: Granularity;
    timezone: string;
    previousFrom: string;
    previousTo: string;
  };
  summary: StatsSummary;
  previous: StatsSummary;
  trend: TrendPoint[];
  paymentMethods: PaymentShare[];
  services: ServiceStat[];
  hours: HourCell[];
}
