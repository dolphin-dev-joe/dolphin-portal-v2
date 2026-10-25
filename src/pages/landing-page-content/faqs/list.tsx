import DataTable from "@components/table";
import { ActionButton } from "@components/table/types";
import { columnsFaq } from "@features/landing-page-content/faqs/columns";
import { IFaq } from "@features/landing-page-content/faqs/interfaces";

export default function FaqsListPage() {
  return (
    <DataTable<IFaq>
      resource={"faqs"}
      actionColumns={[
        ActionButton.Create,
        ActionButton.Edit,
        ActionButton.Delete,
      ]}
      columns={columnsFaq}
      withSearch
    />
  );
}
