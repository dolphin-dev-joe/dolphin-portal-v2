import { useParsed } from "@refinedev/core";
import { SocialPostDetail } from "@features/content-studio/social-posts/detail";

export default function SocialPostShowPage() {
  const { id } = useParsed();
  return <SocialPostDetail key={id} />;
}
