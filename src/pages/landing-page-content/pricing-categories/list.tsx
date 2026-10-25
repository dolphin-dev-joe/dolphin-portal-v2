import DataTable from "@components/table";
import { ActionButton } from "@components/table/types";
import { columnsPricingCategory } from "@features/landing-page-content/pricing-categories/columns";
import { IPricingCategory } from "@features/landing-page-content/pricing-categories/interfaces";

export default function PricingCategoriesPage() {
  // return <PricingCategoriesList />;
  return (
    <DataTable<IPricingCategory>
      resource={"pricing-categories"}
      columns={columnsPricingCategory}
      actionColumns={[
        ActionButton.Create,
        ActionButton.Delete,
        ActionButton.Edit,
        ActionButton.Show,
      ]}
      withSearch
    />
  );
}
