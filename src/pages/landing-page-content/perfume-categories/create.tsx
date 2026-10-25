import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsPerfumeCategories } from "@features/landing-page-content/perfume-categories/tabs";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function CreatePerfumeCategoryPage() {
  const methods = useForm({
    refineCoreProps: {
      resource: "perfume-categories",
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsPerfumeCategories(false)} />;
}
