import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsPosCourierFee } from "@features/pos/courier-fees/tabs";
import { defineMeta } from "@providers/data-provider/meta";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

export default function PosCourierFeeEditPage() {
  const { id } = useParsed();
  const methods = useForm({
    refineCoreProps: {
      resource: "pos-courier-fees",
      id,
      meta: defineMeta({
        getEndpoint: "pos/courier-fees",
      }),
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsPosCourierFee} />;
}
