import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsPerfumes } from "@features/landing-page-content/perfumes/tabs";
import { defineMeta } from "@providers/data-provider/meta";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

export default function ShowPerfumePage() {
  const { id } = useParsed();
  const methods = useForm({
    refineCoreProps: {
      resource: "perfumes",
      id: id,
      meta: defineMeta({
        getEndpoint: "perfumes",
      }),
    },
  });
  return <CreateOrEditWrapper methods={methods} tabs={tabsPerfumes} isShow />;
}
