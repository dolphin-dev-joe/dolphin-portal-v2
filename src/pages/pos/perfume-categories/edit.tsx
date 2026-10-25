import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsPosPerfumeCategory } from "@features/pos/perfume-categories/tabs";
import { defineMeta } from "@providers/data-provider/meta";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function PosPerfumeCategoryEditPage() {
  const { id } = useParsed();
  const methods = useForm({
    refineCoreProps: {
      resource: "pos-perfume-categories",
      id,
      meta: defineMeta({
        getEndpoint: "pos/perfume-categories",
      }),
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsPosPerfumeCategory} />;
}
