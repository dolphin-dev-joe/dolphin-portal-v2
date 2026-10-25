import ListBoxView, { ListBoxViewItem } from "@components/list-box-view";
import { IPricing } from "@features/landing-page-content/pricings/interfaces";
import { useOne } from "@refinedev/core";
import { useParams } from "react-router";
import React from "react";

export default function PricingInCategories() {
  const params = useParams<{ id: string }>();

  const {
    result,
    query: { isLoading },
  } = useOne<IPricing[]>({
    id: params?.id,
    resource: "pricings/by-category",
    queryOptions: {
      retry: false,
    },
  });

  const items: ListBoxViewItem[] =
    result?.map((pricing: IPricing) => ({
      id: pricing.id,
      label: pricing.name,
      description: pricing.nameEn || undefined,
      badge: `Sort: ${pricing.sortOrder}`,
    })) ?? [];

  return (
    <ListBoxView
      items={items}
      isLoading={isLoading}
      maxHeight="470px"
      ariaLabel="pricings-in-categories"
      emptyText="No pricings found."
    />
  );
}
