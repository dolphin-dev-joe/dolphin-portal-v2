import { useCustomMutation, useInvalidate } from "@refinedev/core";
import { Icon } from "@iconify/react";

import DataTable from "@components/table";
import { ActionButton, CustomRowActionButton } from "@components/table/types";
import { columnsPosTransaction } from "@features/pos/transactions/columns";
import { IPosTransaction } from "@features/pos/transactions/interfaces";
import LoadingScreen from "@components/loading/LoadingScreen";

export default function PosCancelledTransactionsListPage() {
  const invalidate = useInvalidate();
  const { mutate: restore, mutation } = useCustomMutation();

  const handleRestore = (tx: IPosTransaction) => {
    if (mutation.isPending) return;
    restore(
      {
        url: `pos/transactions/${tx.id}/status`,
        method: "patch",
        values: { status: "pending" },
        successNotification: {
          message: `Transaksi ${tx.invoiceNumber} dipulihkan ke status Masuk.`,
          type: "success",
        },
        errorNotification: {
          message: "Gagal memulihkan transaksi.",
          type: "error",
        },
      },
      {
        onSuccess: () =>
          invalidate({ resource: "pos-transactions", invalidates: ["list"] }),
      },
    );
  };

  const rowActions: CustomRowActionButton<IPosTransaction>[] = [
    {
      key: "restore",
      label: "Pulihkan",
      ariaLabel: "Pulihkan transaksi",
      variant: "secondary",
      icon: <Icon icon="mdi:restore" width={16} />,
      onPress: handleRestore,
      isDisabled: () => mutation.isPending,
    },
  ];

  return (
    <>
      <LoadingScreen isLoading={mutation.isPending} />
      <DataTable<IPosTransaction>
        resource="pos-transactions"
        label="Transaksi Dibatalkan"
        description="Transaksi yang dibatalkan kasir. Pulihkan bila pembatalan karena human error."
        columns={columnsPosTransaction}
        withSearch
        permanentFilters={[{ field: "status", value: "cancelled" }]}
        actionColumns={[ActionButton.Show]}
        customRowActionButtons={rowActions}
      />
    </>
  );
}
