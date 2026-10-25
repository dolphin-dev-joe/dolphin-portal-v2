import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsPosServiceCategory } from "@features/pos/service-categories/tabs";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function PosServiceCategoryCreatePage() {
  const methods = useForm({
    refineCoreProps: {
      resource: "pos-service-categories",
    },
    defaultValues: {
      isActive: true,
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsPosServiceCategory} />;
}
