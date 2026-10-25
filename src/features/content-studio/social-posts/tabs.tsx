import SocialPostForm from "./form/Detail";

export const tabsSocialPost = [
  {
    label: "Postingan",
    content: <SocialPostForm />,
  },
];

/** Values a new post starts with. */
export const SOCIAL_POST_DEFAULTS = {
  platform: "instagram",
  format: "carousel",
  status: "draft",
  media: [],
  caption: "",
  scheduledAt: null,
  postedAt: null,
};
