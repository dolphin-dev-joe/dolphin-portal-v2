import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsFaqs } from "@features/landing-page-content/faqs/tabs";
import { defineMeta } from "@providers/data-provider/meta";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function FaqEditPage() {
  const { id } = useParsed();
  const methods = useForm({
    refineCoreProps: {
      resource: "faqs",
      id: id,
      meta: defineMeta({
        getEndpoint: "faqs",
      }),
    },
  });
  return <CreateOrEditWrapper methods={methods} tabs={tabsFaqs} />;
}
