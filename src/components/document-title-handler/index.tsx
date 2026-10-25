import { useParsed } from "@refinedev/core";
import { useEffect } from "react";
import { resources } from "@routes/resources";

export const DocumentTitleHandler = () => {
  const { resource, action, id } = useParsed();

  useEffect(() => {
    // Default title
    let title = "Dolphin Portal";
    let currentResource = null;

    if (resource) {
      // Handle case where resource is an object or string
      const resourceName =
        typeof resource === "string" ? resource : resource.name;
      currentResource = resources.find((r) => r.name === resourceName);
    }

    if (currentResource) {
      const label = currentResource.meta?.label || currentResource.name;

      const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);

      switch (action) {
        case "list":
          title = `${capitalizedLabel} | Dolphin Portal`;
          break;
        case "create":
          title = `Create ${capitalizedLabel} | Dolphin Portal`;
          break;
        case "edit":
          title = `Edit ${capitalizedLabel} ${
            id ? `#${id}` : ""
          } | Dolphin Portal`;
          break;
        case "show":
          title = `${capitalizedLabel} ${id ? `#${id}` : ""} | Dolphin Portal`;
          break;
        default:
          title = `${capitalizedLabel} | Dolphin Portal`;
          break;
      }
    }

    document.title = title;
  }, [resource, action, id]);

  return null;
};
