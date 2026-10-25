
// import { PerfumeForm } from "@/features/landing-page-content/perfumes/form";

// export default function CreatePerfumePage() {
//   return <PerfumeForm mode="create" />;
// }import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsPerfumes } from "@features/landing-page-content/perfumes/tabs";
// import { CreateOrEditWrapper } from "@components/form/CreateOrEditWrapper";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function CreatePerfumePage() {
  const methods = useForm({
    refineCoreProps: {
      resource: "perfumes",
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsPerfumes} />;
}
