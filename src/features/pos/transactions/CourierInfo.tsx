import { Card, Typography } from "@heroui/react";
import { Icon } from "@iconify/react";
import { formatDateTimeShort } from "@utils/date";
import { PAYMENT_LABELS, formatIDR } from "./config";
import { InfoField } from "./InfoField";
import { PaymentProof } from "./PaymentProof";
import { PaymentStatusChip } from "./StatusChip";
import { courierChargesOf, IPosTransaction } from "./interfaces";

/**
 * Pickup (jemput) / delivery (antar) of an order: where to go, the charges
 * and whether each one is paid. Nothing when the order has neither.
 * A charge added after the order was paid is paid on its own on the POS,
 * so it gets its own status and, for QRIS/transfer, its own proof photo.
 */
export function CourierInfo({ tx }: { tx: IPosTransaction }) {
  const charges = courierChargesOf(tx);
  if (charges.length === 0 && !tx.courierAddress && !tx.courierNote) return null;

  return (
    <Card>
      <Card.Content className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Icon icon="mdi:moped-outline" width={18} className="text-muted" />
          <Typography
            type="body-xs"
            color="muted"
            weight="semibold"
            className="uppercase tracking-wide"
          >
            Antar Jemput
          </Typography>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoField label="Alamat" value={tx.courierAddress || "-"} />
          <InfoField label="Catatan Kurir" value={tx.courierNote || "-"} />
        </div>

        {charges.length > 0 && (
          <div className="space-y-2">
            {charges.map((c) => (
              <div
                key={c.kind}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-divider p-3"
              >
                <div>
                  <Typography type="body-sm" weight="medium">
                    {c.label} · {formatIDR(c.amount)}
                  </Typography>
                  <Typography type="body-xs" color="muted">
                    {c.paidAt
                      ? `Dibayar ${formatDateTimeShort(c.paidAt)}${
                          c.method ? ` via ${PAYMENT_LABELS[c.method] ?? c.method}` : ""
                        }`
                      : "Belum dibayar — ditagih di POS saat diantar/diserahkan"}
                  </Typography>
                </div>
                <PaymentStatusChip status={c.paidAt ? "paid" : "unpaid"} size="sm" />
              </div>
            ))}
          </div>
        )}

        {charges.map((c) => (
          <PaymentProof
            key={`proof-${c.kind}`}
            tx={tx}
            fee={{ kind: c.kind, label: c.label, proofPath: c.proofPath }}
          />
        ))}
      </Card.Content>
    </Card>
  );
}
