import PerfumeCategoryForm from "./form/Detail";
import PerfumesInCategories from "./form/PerfumesInCategories";

export const tabsPerfumeCategories = (isShow: boolean = false) => {
  const tabs = [
    {
      label: "Details",
      content: <PerfumeCategoryForm />,
    },
  ];

  if (isShow) {
    tabs.push({
      label: "Perfumes in this Category",
      content: <PerfumesInCategories />,
    });
  }

  return tabs;
};
