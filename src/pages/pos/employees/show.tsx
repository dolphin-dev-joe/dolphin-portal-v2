import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsPosEmployee } from "@features/pos/employees/tabs";
import { defineMeta } from "@providers/data-provider/meta";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function PosEmployeeShowPage() {
  const { id } = useParsed();
  const methods = useForm({
    refineCoreProps: {
      resource: "pos-employees",
      id,
      meta: defineMeta({
        getEndpoint: "pos/employees",
      }),
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsPosEmployee} isShow />;
}
