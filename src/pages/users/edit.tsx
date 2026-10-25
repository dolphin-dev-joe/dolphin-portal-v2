import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import Detail from "@features/portal/users/form/Detail";
import { defineMeta } from "@providers/data-provider/meta";
import { useForm } from "@refinedev/react-hook-form";
import { useParams } from "react-router";

export default function UserEditPage() {
  const params = useParams<{ id: string }>();
  const methods = useForm({
    refineCoreProps: {
      action: "edit",
      resource: "users",
      id: params?.id,

      meta: defineMeta({
        getEndpoint: "users",
      }),
    },
  });

  return (
    <>
      <CreateOrEditWrapper
        methods={methods}
        tabs={[
          {
            content: <Detail />,
            label: "Detail",
          },
        ]}
      />
    </>
  );
}
