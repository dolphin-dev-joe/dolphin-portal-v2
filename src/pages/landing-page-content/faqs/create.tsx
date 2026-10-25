import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsFaqs } from "@features/landing-page-content/faqs/tabs";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function FaqCreatePage() {
  const methods = useForm({
    refineCoreProps: {
      resource: "faqs",
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsFaqs} />;
}
