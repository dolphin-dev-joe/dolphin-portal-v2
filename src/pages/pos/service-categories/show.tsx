import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsPosServiceCategory } from "@features/pos/service-categories/tabs";
import { defineMeta } from "@providers/data-provider/meta";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function PosServiceCategoryShowPage() {
  const { id } = useParsed();
  const methods = useForm({
    refineCoreProps: {
      resource: "pos-service-categories",
      id,
      meta: defineMeta({
        getEndpoint: "pos/service-categories",
      }),
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsPosServiceCategory} isShow />;
}
