import DataTable from "@components/table";
import { ActionButton } from "@components/table/types";
import { columnsArticle } from "@features/landing-page-content/articles/columns";
import { IArticle } from "@features/landing-page-content/articles/interfaces";

export default function ArticlesListPage() {
  return (
    <DataTable<IArticle>
      resource={"articles"}
      actionColumns={[
        ActionButton.Create,
        ActionButton.Edit,
        ActionButton.Show,
        ActionButton.Delete,
      ]}
      columns={columnsArticle}
      withSearch
    />
  );
}
