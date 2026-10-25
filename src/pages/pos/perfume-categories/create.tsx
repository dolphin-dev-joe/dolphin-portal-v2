import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsPosPerfumeCategory } from "@features/pos/perfume-categories/tabs";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function PosPerfumeCategoryCreatePage() {
  const methods = useForm({
    refineCoreProps: {
      resource: "pos-perfume-categories",
    },
    defaultValues: {
      isActive: true,
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsPosPerfumeCategory} />;
}
