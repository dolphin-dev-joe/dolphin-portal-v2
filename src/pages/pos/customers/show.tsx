import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsPosCustomer } from "@features/pos/customers/tabs";
import { defineMeta } from "@providers/data-provider/meta";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function PosCustomerShowPage() {
  const { id } = useParsed();
  const methods = useForm({
    refineCoreProps: {
      resource: "pos-customers",
      id,
      meta: defineMeta({
        getEndpoint: "pos/customers",
      }),
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsPosCustomer} isShow />;
}
