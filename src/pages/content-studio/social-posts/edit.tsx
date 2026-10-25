import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import { tabsSocialPost } from "@features/content-studio/social-posts/tabs";
import { useParsed } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

export default function SocialPostEditPage() {
  const { id } = useParsed();
  const methods = useForm({
    refineCoreProps: { resource: "social-posts", id },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsSocialPost} />;
}
