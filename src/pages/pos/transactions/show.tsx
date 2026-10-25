import {
  useOne,
  useParsed,
  useInvalidate,
  useCustomMutation,
} from "@refinedev/core";
import {
  Button,
  Card,
  Chip,
  EmptyState,
  Separator,
  Skeleton,
  Spinner,
  Table,
  Typography,
  cn,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { IPosTransaction } from "@features/pos/transactions/interfaces";
import { StatusChip } from "@features/pos/transactions/StatusChip";
import { InfoField } from "@features/pos/transactions/InfoField";
import {
  STATUS_CONFIG,
  WORKFLOW,
  NEXT_LABEL,
  TERMINAL_STATUSES,
  PAYMENT_LABELS,
  formatIDR,
  type WorkflowStatus,
} from "@features/pos/transactions/config";
import { formatDateTimeShort } from "@utils/date";
import LoadingScreen from "@components/loading/LoadingScreen";

export default function PosTransactionShowPage() {
  const { id } = useParsed();
  const invalidate = useInvalidate();

  const { result: tx, query } = useOne<IPosTransaction>({
    resource: "pos-transactions",
    id,
  });

  const { mutate: updateStatus, mutation } = useCustomMutation();
  const isUpdating = mutation.isPending;

  const handleStatusUpdate = (newStatus: string) => {
    if (!id || isUpdating) return;
    updateStatus(
      {
        url: `pos/transactions/${id}/status`,
        method: "patch",
        values: { status: newStatus },
      },
      {
        onSuccess: () =>
          invalidate({
            resource: "pos-transactions",
            id,
            invalidates: ["detail"],
          }),
      },
    );
  };

  if (query.isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        <Skeleton className="h-16 w-full rounded-xl" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <EmptyState className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <Icon
            icon="mdi:alert-circle-outline"
            width={40}
            className="text-danger"
          />
          <Typography type="body" color="muted">
            Transaksi tidak ditemukan.
          </Typography>
        </EmptyState>
      </div>
    );
  }

  const currentStep = WORKFLOW.indexOf(tx.status as WorkflowStatus);
  const isTerminal = TERMINAL_STATUSES.includes(tx.status);
  const nextStatus =
    !isTerminal && currentStep > -1 && currentStep < WORKFLOW.length - 1
      ? WORKFLOW[currentStep + 1]
      : null;
  const showWorkflow = tx.status !== "cancelled" && tx.status !== "completed";
  const items = tx.items ?? [];

  return (
    <div className="max-w-full mx-auto  space-y-6">
      <LoadingScreen isLoading={query.isLoading || mutation.isPending} />
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Typography
            type="body-xs"
            color="muted"
            className="uppercase tracking-wide mb-1"
          >
            No. Invoice
          </Typography>
          <Typography type="h4" className="font-mono">
            {tx.invoiceNumber}
          </Typography>
          <Typography type="body-sm" color="muted" className="mt-0.5">
            {formatDateTimeShort(tx.createdAt)}
          </Typography>
        </div>
        <StatusChip status={tx.status} size="lg" />
      </div>

      {/* Status Workflow */}
      {showWorkflow ? (
        <Card>
          <Card.Content className="p-4">
            <Typography
              type="body-xs"
              color="muted"
              weight="semibold"
              className="uppercase tracking-wide mb-4"
            >
              Alur Status
            </Typography>

            <div className="flex items-center overflow-x-auto pb-2">
              {WORKFLOW.map((step, idx) => {
                const stepCfg = STATUS_CONFIG[step];
                const isDone = currentStep > idx;
                const isCurrent = currentStep === idx;
                return (
                  <div key={step} className="flex items-center shrink-0">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center transition-all",
                          isDone && "bg-success text-success-foreground",
                          isCurrent &&
                            "bg-accent text-accent-foreground ring-4 ring-accent/20",
                          !isDone &&
                            !isCurrent &&
                            "bg-surface-tertiary text-muted",
                        )}
                      >
                        <Icon
                          icon={isDone ? "mdi:check" : stepCfg.icon}
                          width={18}
                        />
                      </div>
                      <Typography
                        type="body-xs"
                        className={cn(
                          "text-center max-w-18",
                          isCurrent
                            ? "text-accent font-semibold"
                            : isDone
                            ? "text-foreground"
                            : "text-muted",
                        )}
                      >
                        {stepCfg.label}
                      </Typography>
                    </div>
                    {idx < WORKFLOW.length - 1 && (
                      <div
                        className={cn(
                          "h-0.5 w-8 md:w-12 shrink-0 mx-1 rounded-full transition-all",
                          isDone ? "bg-success" : "bg-surface-tertiary",
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action buttons */}
            {!isTerminal && (
              <div className="flex gap-2 mt-4 flex-wrap">
                {nextStatus && (
                  <Button
                    onPress={() => handleStatusUpdate(nextStatus)}
                    isPending={isUpdating}
                    isDisabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Spinner color="current" size="sm" />
                    ) : (
                      <Icon icon="mdi:arrow-right-circle" width={16} />
                    )}
                    {NEXT_LABEL[tx.status] ?? "Lanjutkan"}
                  </Button>
                )}
                <Button
                  variant="danger-soft"
                  onPress={() => handleStatusUpdate("cancelled")}
                  isDisabled={isUpdating}
                >
                  <Icon icon="mdi:close-circle-outline" width={16} />
                  Batalkan Transaksi
                </Button>
              </div>
            )}
          </Card.Content>
        </Card>
      ) : (
        <Card variant="transparent">
          <Card.Content
            className={cn(
              "p-3 flex items-center gap-2 rounded-xl border",
              tx.status === "cancelled"
                ? "border-danger/30 bg-danger/5 text-danger"
                : "border-success/30 bg-success/5 text-success",
            )}
          >
            <Icon
              icon={
                tx.status === "cancelled"
                  ? "mdi:close-circle"
                  : "mdi:check-circle"
              }
              width={18}
            />
            <Typography type="body-sm">
              {tx.status === "cancelled"
                ? "Transaksi ini telah dibatalkan."
                : "Transaksi selesai — pelanggan sudah mengambil laundry."}
            </Typography>

            {tx.status === "cancelled" && (
              <Button
                variant="secondary"
                size="sm"
                className="ml-auto"
                onPress={() => handleStatusUpdate("pending")}
                isPending={isUpdating}
                isDisabled={isUpdating}
              >
                {isUpdating ? (
                  <Spinner color="current" size="sm" />
                ) : (
                  <Icon icon="mdi:restore" width={16} />
                )}
                Pulihkan
              </Button>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Transaction Info */}
      <Card>
        <Card.Content className="grid grid-cols-2 gap-4 p-4">
          <InfoField label="Pelanggan" value={tx.customerName} />
          <InfoField label="Kasir" value={tx.cashierName} />
          <InfoField label="Parfum" value={tx.perfumeName ?? "-"} />
          <InfoField
            label="Estimasi Selesai"
            value={
              tx.estimatedCompletionAt
                ? formatDateTimeShort(tx.estimatedCompletionAt)
                : "-"
            }
          />
        </Card.Content>
      </Card>

      {/* Items */}
      <div className="space-y-2">
        <Typography
          type="body-xs"
          color="muted"
          weight="semibold"
          className="uppercase tracking-wide"
        >
          Item Layanan
        </Typography>
        <Card className="p-0">
          <Table>
            <Table.ScrollContainer>
              <Table.Content
                aria-label="Item layanan transaksi"
                className="min-w-125"
              >
                <Table.Header>
                  <Table.Column isRowHeader>Layanan</Table.Column>
                  <Table.Column className="text-center">Qty</Table.Column>
                  <Table.Column className="text-end">Harga</Table.Column>
                  <Table.Column className="text-end">Subtotal</Table.Column>
                  <Table.Column>Catatan</Table.Column>
                </Table.Header>
                <Table.Body
                  items={items}
                  renderEmptyState={() => (
                    <EmptyState className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                      <Icon
                        icon="heroicons:inbox"
                        className="size-6 text-muted"
                      />
                      <Typography type="body-sm" color="muted">
                        Tidak ada item
                      </Typography>
                    </EmptyState>
                  )}
                >
                  {(item) => (
                    <Table.Row key={String(item.id)}>
                      <Table.Cell className="font-medium">
                        {item.serviceName}
                      </Table.Cell>
                      <Table.Cell className="text-center text-muted">
                        {item.quantity}
                      </Table.Cell>
                      <Table.Cell className="text-end text-muted">
                        {formatIDR(item.price)}
                      </Table.Cell>
                      <Table.Cell className="text-end font-semibold">
                        {formatIDR(Number(item.price) * Number(item.quantity))}
                      </Table.Cell>
                      <Table.Cell className="text-muted">
                        {item.note ?? "-"}
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </Card>
      </div>

      {/* Payment Summary */}
      <Card>
        <Card.Content className="p-4 space-y-2">
          <Typography
            type="body-xs"
            color="muted"
            weight="semibold"
            className="uppercase tracking-wide mb-1"
          >
            Ringkasan Pembayaran
          </Typography>
          <div className="flex justify-between">
            <Typography type="body-sm" color="muted">
              Subtotal
            </Typography>
            <Typography type="body-sm">{formatIDR(tx.subtotal)}</Typography>
          </div>
          <Separator className="my-1" />
          <div className="flex justify-between items-center">
            <Typography type="body" weight="bold">
              Total
            </Typography>
            <Typography type="h5" weight="bold">
              {formatIDR(tx.total)}
            </Typography>
          </div>
          <div className="flex justify-between items-center pt-1">
            <Typography type="body-sm" color="muted">
              Metode Pembayaran
            </Typography>
            <Chip variant="soft" color="accent">
              <Chip.Label>
                {PAYMENT_LABELS[tx.paymentMethod] ?? tx.paymentMethod}
              </Chip.Label>
            </Chip>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
