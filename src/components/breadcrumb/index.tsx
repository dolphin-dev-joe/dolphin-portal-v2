import { useBreadcrumb } from "@refinedev/core";
import { Breadcrumbs } from "@heroui/react";
import { Link } from "react-router";

export const Breadcrumb = () => {
  const { breadcrumbs } = useBreadcrumb();

  return (
    <div className="py-4 px-4">
      <Breadcrumbs>
        {breadcrumbs.map((breadcrumb) => {
          return (
            <Breadcrumbs.Item key={`breadcrumb-${breadcrumb.label}`}>
              {breadcrumb.href ? (
                <Link to={breadcrumb.href}>{breadcrumb.label}</Link>
              ) : (
                <span>{breadcrumb.label}</span>
              )}
            </Breadcrumbs.Item>
          );
        })}
      </Breadcrumbs>
    </div>
  );
};
