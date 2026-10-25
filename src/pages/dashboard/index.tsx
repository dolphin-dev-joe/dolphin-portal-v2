import { useCustom } from "@refinedev/core";
import { useAppSwitcher } from "@/contexts/AppSwitcherContext";
import LoadingScreen from "@components/loading/LoadingScreen";
import DashboardContent, { type PosStats } from "./DashboardContent";
import LandingDashboard, { type LandingStats } from "./LandingDashboard";
import PortalDashboard, { type PortalStats } from "./PortalDashboard";
import ContentDashboard, { type ContentStats } from "./ContentDashboard";

const EMPTY_POS: PosStats = {
  todayTransactions: 0,
  todayRevenue: 0,
  totalCustomers: 0,
  activeServices: 0,
  recentTransactions: [],
};

const EMPTY_LANDING: LandingStats = {
  totalPerfumes: 0,
  totalPerfumeCategories: 0,
  totalPricings: 0,
  totalFaqs: 0,
};

const EMPTY_PORTAL: PortalStats = {
  totalUsers: 0,
  activeUsers: 0,
  adminUsers: 0,
};

const EMPTY_CONTENT: ContentStats = {
  ideas: 0,
  drafts: 0,
  inReview: 0,
  ready: 0,
  postedThisMonth: 0,
  publishedArticles: 0,
  draftArticles: 0,
};

// Each app's stats come from its own API endpoint, so only the
// dashboard that is on screen is fetched.
const STATS_ENDPOINT = {
  pos: "pos/dashboard",
  "landing-page": "dashboard/landing",
  portal: "dashboard/portal",
  content: "dashboard/content",
} as const;

export default function DashboardPage() {
  const { activeApp } = useAppSwitcher();
  const endpoint =
    STATS_ENDPOINT[activeApp as keyof typeof STATS_ENDPOINT] ?? STATS_ENDPOINT.pos;

  const { result, query } = useCustom<{ data: unknown }>({
    url: endpoint,
    method: "get",
    errorNotification: false,
  });

  if (query.isLoading) return <LoadingScreen />;

  const stats = result?.data?.data;

  if (activeApp === "landing-page") {
    return <LandingDashboard stats={(stats as LandingStats) ?? EMPTY_LANDING} />;
  }
  if (activeApp === "portal") {
    return <PortalDashboard stats={(stats as PortalStats) ?? EMPTY_PORTAL} />;
  }
  if (activeApp === "content") {
    return <ContentDashboard stats={(stats as ContentStats) ?? EMPTY_CONTENT} />;
  }
  return <DashboardContent stats={(stats as PosStats) ?? EMPTY_POS} />;
}
