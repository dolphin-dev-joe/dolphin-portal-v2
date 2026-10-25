import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsPricingCategories } from "@features/landing-page-content/pricing-categories/tabs";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function CreatePricingCategoryPage() {
  const methods = useForm({
    refineCoreProps: {
      resource: "pricing-categories",
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsPricingCategories(false)} />;
}
