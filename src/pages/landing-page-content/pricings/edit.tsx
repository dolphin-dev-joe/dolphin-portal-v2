import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsPricingItems } from "@features/landing-page-content/pricings/tabs";
import { defineMeta } from "@providers/data-provider/meta";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function EditPricingItemPage() {
  const { id } = useParsed();
  const methods = useForm({
    refineCoreProps: {
      resource: "pricings",
      id: id,
      meta: defineMeta({
        getEndpoint: "pricings",
      }),
    },
  });
  return <CreateOrEditWrapper methods={methods} tabs={tabsPricingItems} />;
}
