import React from "react";
import { useParsed } from "@refinedev/core";
import { ArticleDetail } from "@features/landing-page-content/articles/detail";

export default function ArticleShowPage() {
  const { id } = useParsed();
  return <ArticleDetail key={id} />;
}
