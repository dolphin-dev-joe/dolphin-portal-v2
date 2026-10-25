import DataTable from "@components/table";
import { ActionButton } from "@components/table/types";
import { columnsPricingItems } from "@features/landing-page-content/pricings/columns";
import { IPricing } from "@features/landing-page-content/pricings/interfaces";
import { usePricingFilters } from "@features/landing-page-content/pricings/filters";

export default function PricingItemsPage() {
  const filters = usePricingFilters();

  return (
    <DataTable<IPricing>
      resource="pricings"
      columns={columnsPricingItems}
      withSearch
      customFilters={filters}
      actionColumns={[
        ActionButton.Create,
        ActionButton.Edit,
        ActionButton.Delete,
      ]}
    />
  );
}
