import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsPricingItems } from "@features/landing-page-content/pricings/tabs";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function CreatePricingItemPage() {
  const methods = useForm({
    refineCoreProps: {
      resource: "pricings",
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsPricingItems} />;
}
