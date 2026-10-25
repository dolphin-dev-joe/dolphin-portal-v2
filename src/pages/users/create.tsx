import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import Detail from "@features/portal/users/form/Detail";
import { useForm } from "@refinedev/react-hook-form";

export default function UserCreatePage() {
  const methods = useForm({
    refineCoreProps: {
      action: "create",
      resource: "users",
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
