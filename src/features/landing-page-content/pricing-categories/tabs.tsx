import PricingCategoryForm from "./form/Detail";
import PricingInCategories from "./form/PricingInCategories";

export const tabsPricingCategories = (isShow: boolean = false) => {
  const tabs = [
    {
      label: "Detail",
      content: <PricingCategoryForm />,
    },
  ];

  if (isShow) {
    tabs.push({
      label: "Pricing in this Category",
      content: <PricingInCategories />,
    });
  }

  return tabs;
};
