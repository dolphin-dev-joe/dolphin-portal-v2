import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsArticles } from "@features/landing-page-content/articles/tabs";
import { defineMeta } from "@providers/data-provider/meta";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function ArticleEditPage() {
  const { id } = useParsed();
  const methods = useForm({
    refineCoreProps: {
      resource: "articles",
      id: id,
      meta: defineMeta({
        getEndpoint: "articles",
      }),
    },
  });
  return <CreateOrEditWrapper methods={methods} tabs={tabsArticles} />;
}
