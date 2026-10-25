import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsPricingCategories } from "@features/landing-page-content/pricing-categories/tabs";
import { defineMeta } from "@providers/data-provider/meta";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function EditPricingCategoryPage() {
  const { id } = useParsed();
  const methods = useForm({
    refineCoreProps: {
      resource: "pricing-categories",
      id: id,
      meta: defineMeta({
        getEndpoint: "pricing-categories",
      }),
    },
  });
  return <CreateOrEditWrapper methods={methods} tabs={tabsPricingCategories(false)} />;
}
