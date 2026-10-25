import ListBoxView, { ListBoxViewItem } from "@components/list-box-view";
import { IPerfume } from "@features/landing-page-content/perfumes/interfaces";
import { useOne } from "@refinedev/core";
import { useParams } from "react-router";
import React from "react";
// import ListBoxView, { ListBoxViewItem } from "./ListBoxView";

export default function PerfumesInCategories() {
  const params = useParams<{ id: string }>();

  const {
    result,
    query: { isLoading },
  } = useOne<IPerfume[]>({
    id: params?.id,
    resource: "perfumes/by-categories",
    queryOptions: {
      retry: false,
    },
  });

  const items: ListBoxViewItem[] =
    result?.map((perfume: IPerfume) => ({
      id: perfume.id,
      label: perfume.name,
      description: perfume.nameEn,
      badge: `Sort: ${perfume.sortOrder}`,
    })) ?? [];

  return (
    <ListBoxView
      items={items}
      isLoading={isLoading}
      ariaLabel="perfumes-in-categories"
      emptyText="No perfumes found."
    />
  );
}
