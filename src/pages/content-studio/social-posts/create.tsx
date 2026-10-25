import CreateOrEditWrapper from "@components/form/CreateOrEditWrapper";
import {
  SOCIAL_POST_DEFAULTS,
  tabsSocialPost,
} from "@features/content-studio/social-posts/tabs";
import { useForm } from "@refinedev/react-hook-form";
import { useSearchParams } from "react-router";

/** `?date=2026-10-24` (from the calendar) → 10:00 local time on that day. */
function scheduleFromQuery(date: string | null): string | null {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const d = new Date(`${date}T10:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export default function SocialPostCreatePage() {
  const [params] = useSearchParams();
  const methods = useForm({
    refineCoreProps: { resource: "social-posts" },
    defaultValues: {
      ...SOCIAL_POST_DEFAULTS,
      scheduledAt: scheduleFromQuery(params.get("date")),
    },
  });

  return <CreateOrEditWrapper methods={methods} tabs={tabsSocialPost} />;
}
