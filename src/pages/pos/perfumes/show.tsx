import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsPosPerfume } from "@features/pos/perfumes/tabs";
import { defineMeta } from "@providers/data-provider/meta";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function PosPerfumeShowPage() {
  const { id } = useParsed();
  const methods = useForm({
    refineCoreProps: {
      resource: "pos-perfumes",
      id,
      meta: defineMeta({
        getEndpoint: "pos/perfumes",
      }),
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsPosPerfume} isShow />;
}
