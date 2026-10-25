import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsArticles } from "@features/landing-page-content/articles/tabs";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";

export default function ArticleCreatePage() {
  const methods = useForm({
    refineCoreProps: {
      resource: "articles",
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsArticles} />;
}
