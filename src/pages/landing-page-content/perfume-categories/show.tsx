import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsPerfumeCategories } from "@features/landing-page-content/perfume-categories/tabs";
import { useForm } from "@refinedev/react-hook-form";
import { useParams } from "react-router";

export default function ShowPerfumeCategoryPage() {
  const params = useParams<{ id: string }>();

  const methods = useForm({
    refineCoreProps: {
      resource: "perfume-categories",
      id: params?.id,
    },
  });

  return (
    <CreateOrEditWrapper
      methods={methods}
      isShow
      tabs={tabsPerfumeCategories(true)}
    />
  );
}
