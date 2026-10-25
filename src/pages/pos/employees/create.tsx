import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsPosEmployee } from "@features/pos/employees/tabs";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function PosEmployeeCreatePage() {
  const methods = useForm({
    refineCoreProps: {
      resource: "pos-employees",
    },
    defaultValues: {
      isActive: true,
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsPosEmployee} />;
}
