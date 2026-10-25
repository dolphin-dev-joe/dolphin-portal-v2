import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsPosService } from "@features/pos/services/tabs";
import { defineMeta } from "@providers/data-provider/meta";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function PosServiceEditPage() {
  const { id } = useParsed();
  const methods = useForm({
    refineCoreProps: {
      resource: "pos-services",
      id,
      meta: defineMeta({
        getEndpoint: "pos/services",
      }),
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsPosService} />;
}
