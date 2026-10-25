import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsPricingCategories } from "@features/landing-page-content/pricing-categories/tabs";
import { useForm } from "@refinedev/react-hook-form";
import { useParams } from "react-router";
import React from "react";

export default function PricingCategoryShowPage() {
  const params = useParams<{ id: string }>();

  const methods = useForm({
    refineCoreProps: {
      resource: "pricing-categories",
      id: params?.id,
    },
  });

  return (
    <CreateOrEditWrapper
      methods={methods}
      tabs={tabsPricingCategories(true)}
      isShow
    />
  );
}
