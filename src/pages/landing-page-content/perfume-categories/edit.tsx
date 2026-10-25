import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsPerfumeCategories } from "@features/landing-page-content/perfume-categories/tabs";
import { defineMeta } from "@providers/data-provider/meta";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

export default function EditPerfumeCategoryPage() {
  const { id } = useParsed();
  const methods = useForm({
    refineCoreProps: {
      resource: "perfume-categories",
      id: id,
      meta: defineMeta({
        getEndpoint: "perfume-categories",
      }),
    },
  });
  return <CreateOrEditWrapper methods={methods} tabs={tabsPerfumeCategories(false)} />;
}
