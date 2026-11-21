import { useState } from "react";
import { useCustom } from "@refinedev/core";
import { Button, Skeleton, Spinner, Typography } from "@heroui/react";
import { Icon } from "@iconify/react";
import { CourierFeeKind, IPaymentProofLink, IPosTransaction } from "./interfaces";

// Methods where the cashier must photograph the customer's proof on the POS.
const PROOF_METHODS = ["qris", "transfer"];

interface PaymentProofProps {
  tx: IPosTransaction;
  /**
   * Show the proof of a courier charge paid on its own instead of the
   * order's. Only rendered when that photo exists (a charge paid with the
   * order is covered by the order's proof).
   */
  fee?: { kind: CourierFeeKind; label: string; proofPath: string | null };
}

/**
 * Photo of the QRIS / transfer proof taken on the POS. The bucket is
 * private: the API hands out a link that expires after a few minutes, so it
 * is fetched fresh every time the page opens.
 */
export function PaymentProof({ tx, fee }: PaymentProofProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [renewed, setRenewed] = useState(false);
  const hasProof = fee ? !!fee.proofPath : !!tx.paymentProofPath;

  const { result, query } = useCustom<{ data: IPaymentProofLink }>({
    url: `pos/transactions/${tx.id}/payment-proof`,
    method: "get",
    config: fee ? { query: { fee: fee.kind } } : undefined,
    queryOptions: { enabled: hasProof, staleTime: 0, gcTime: 0 },
    errorNotification: false,
  });

  if (fee) {
    if (!hasProof) return null;
  } else if (!tx.paymentMethod || !PROOF_METHODS.includes(tx.paymentMethod)) {
    return null;
  }

  const url = result?.data?.data?.url;

  return (
    <div className="pt-3 space-y-2">
      <Typography type="body-sm" color="muted">
        {fee ? `Bukti Bayar ${fee.label}` : "Bukti Bayar"}
      </Typography>

      {!hasProof ? (
        <div className="flex items-start gap-2 rounded-xl border border-divider p-3">
          <Icon icon="mdi:image-off-outline" width={18} className="text-muted shrink-0 mt-0.5" />
          <Typography type="body-xs" color="muted">
            Belum ada foto bukti. Transaksi lama, dibayar lewat portal, atau tablet belum
            mengirim fotonya (terkirim otomatis saat tablet online).
          </Typography>
        </div>
      ) : query.isLoading ? (
        <Skeleton className="h-48 w-36 rounded-xl" />
      ) : !url ? (
        <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/5 p-3">
          <Icon icon="mdi:alert-circle-outline" width={18} className="text-danger shrink-0" />
          <Typography type="body-xs" className="text-danger">
            Foto bukti tidak bisa dimuat.
          </Typography>
          <Button
            size="sm"
            variant="secondary"
            className="ml-auto"
            onPress={() => query.refetch()}
            isDisabled={query.isFetching}
          >
            {query.isFetching ? <Spinner color="current" size="sm" /> : <Icon icon="mdi:refresh" width={16} />}
            Coba Lagi
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="block rounded-xl overflow-hidden border border-divider hover:ring-2 hover:ring-accent/40 transition"
          aria-label="Perbesar foto bukti bayar"
        >
          <img
            src={url}
            alt={`Bukti bayar ${tx.invoiceNumber}`}
            className="h-48 w-auto object-cover"
            // The signed link expired while the page stayed open: get a new
            // one, once, so a broken file cannot loop.
            onError={() => {
              if (renewed) return;
              setRenewed(true);
              query.refetch();
            }}
          />
        </button>
      )}

      {isOpen && url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
        >
          <div className="absolute inset-0 bg-black/80" onClick={() => setIsOpen(false)} />
          <div className="relative flex flex-col items-end gap-2 max-h-full">
            <Button size="sm" variant="secondary" onPress={() => setIsOpen(false)} autoFocus>
              <Icon icon="mdi:close" width={16} />
              Tutup
            </Button>
            <img
              src={url}
              alt={`Bukti bayar ${tx.invoiceNumber}`}
              className="max-h-[85vh] max-w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
