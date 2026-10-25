import { lazy, Suspense, type ComponentType } from "react";
import { Outlet, Route, Routes } from "react-router";
import { Authenticated } from "@refinedev/core";
import { CatchAllNavigate, NavigateToResource } from "@refinedev/react-router";

import { Layout } from "@components/layout";
import LoadingScreen from "@components/loading/LoadingScreen";

// Every page is code-split, so the first load only ships what's on screen.
const page = (load: () => Promise<{ default: ComponentType }>) => lazy(load);

const Login = page(() => import("@pages/login"));
const Dashboard = page(() => import("@pages/dashboard"));
const Settings = page(() => import("@pages/settings"));
const NotFound = page(() => import("@pages/not-found"));

/** list/create/edit/show pages for one CRUD resource. */
interface CrudPages {
  path: string;
  list: ReturnType<typeof page>;
  create?: ReturnType<typeof page>;
  edit?: ReturnType<typeof page>;
  show?: ReturnType<typeof page>;
}

const CRUD: CrudPages[] = [
  // ── Landing Page Content ──────────────────────────────────────────────────
  {
    path: "/perfumes",
    list: page(() => import("@pages/landing-page-content/perfumes/list")),
    create: page(() => import("@pages/landing-page-content/perfumes/create")),
    edit: page(() => import("@pages/landing-page-content/perfumes/edit")),
    show: page(() => import("@pages/landing-page-content/perfumes/show")),
  },
  {
    path: "/perfume-categories",
    list: page(() => import("@pages/landing-page-content/perfume-categories/list")),
    create: page(() => import("@pages/landing-page-content/perfume-categories/create")),
    edit: page(() => import("@pages/landing-page-content/perfume-categories/edit")),
    show: page(() => import("@pages/landing-page-content/perfume-categories/show")),
  },
  {
    path: "/pricing-categories",
    list: page(() => import("@pages/landing-page-content/pricing-categories/list")),
    create: page(() => import("@pages/landing-page-content/pricing-categories/create")),
    edit: page(() => import("@pages/landing-page-content/pricing-categories/edit")),
    show: page(() => import("@pages/landing-page-content/pricing-categories/show")),
  },
  {
    path: "/pricings",
    list: page(() => import("@pages/landing-page-content/pricings/list")),
    create: page(() => import("@pages/landing-page-content/pricings/create")),
    edit: page(() => import("@pages/landing-page-content/pricings/edit")),
    show: page(() => import("@pages/landing-page-content/pricings/show")),
  },
  {
    path: "/faqs",
    list: page(() => import("@pages/landing-page-content/faqs/list")),
    create: page(() => import("@pages/landing-page-content/faqs/create")),
    edit: page(() => import("@pages/landing-page-content/faqs/edit")),
    show: page(() => import("@pages/landing-page-content/faqs/show")),
  },
  {
    path: "/articles",
    list: page(() => import("@pages/landing-page-content/articles/list")),
    create: page(() => import("@pages/landing-page-content/articles/create")),
    edit: page(() => import("@pages/landing-page-content/articles/edit")),
    show: page(() => import("@pages/landing-page-content/articles/show")),
  },

  // ── Content Studio (articles above are its blog) ──────────────────────────
  {
    path: "/social-posts",
    list: page(() => import("@pages/content-studio/social-posts/list")),
    create: page(() => import("@pages/content-studio/social-posts/create")),
    edit: page(() => import("@pages/content-studio/social-posts/edit")),
    show: page(() => import("@pages/content-studio/social-posts/show")),
  },
  {
    path: "/content-calendar",
    list: page(() => import("@pages/content-studio/calendar")),
  },

  // ── Portal Management ─────────────────────────────────────────────────────
  {
    path: "/users",
    list: page(() => import("@pages/users/list")),
    create: page(() => import("@pages/users/create")),
    edit: page(() => import("@pages/users/edit")),
    show: page(() => import("@pages/users/show")),
  },

  // ── POS Management ────────────────────────────────────────────────────────
  {
    path: "/pos/perfume-categories",
    list: page(() => import("@pages/pos/perfume-categories/list")),
    create: page(() => import("@pages/pos/perfume-categories/create")),
    edit: page(() => import("@pages/pos/perfume-categories/edit")),
    show: page(() => import("@pages/pos/perfume-categories/show")),
  },
  {
    path: "/pos/service-categories",
    list: page(() => import("@pages/pos/service-categories/list")),
    create: page(() => import("@pages/pos/service-categories/create")),
    edit: page(() => import("@pages/pos/service-categories/edit")),
    show: page(() => import("@pages/pos/service-categories/show")),
  },
  {
    path: "/pos/perfumes",
    list: page(() => import("@pages/pos/perfumes/list")),
    create: page(() => import("@pages/pos/perfumes/create")),
    edit: page(() => import("@pages/pos/perfumes/edit")),
    show: page(() => import("@pages/pos/perfumes/show")),
  },
  {
    path: "/pos/services",
    list: page(() => import("@pages/pos/services/list")),
    create: page(() => import("@pages/pos/services/create")),
    edit: page(() => import("@pages/pos/services/edit")),
    show: page(() => import("@pages/pos/services/show")),
  },
  {
    path: "/pos/display-preview",
    list: page(() => import("@pages/pos/display-preview")),
  },
  {
    path: "/pos/employees",
    list: page(() => import("@pages/pos/employees/list")),
    create: page(() => import("@pages/pos/employees/create")),
    edit: page(() => import("@pages/pos/employees/edit")),
    show: page(() => import("@pages/pos/employees/show")),
  },
  // Customers & transactions are read-only (created by the Flutter POS app).
  {
    path: "/pos/customers",
    list: page(() => import("@pages/pos/customers/list")),
    show: page(() => import("@pages/pos/customers/show")),
  },
  {
    path: "/pos/transactions",
    list: page(() => import("@pages/pos/transactions/list")),
    show: page(() => import("@pages/pos/transactions/show")),
  },
  {
    path: "/pos/cancelled-transactions",
    list: page(() => import("@pages/pos/cancelled-transactions/list")),
  },
];

function ProtectedLayout() {
  return (
    <Authenticated
      key="protected-routes"
      loading={<LoadingScreen />}
      fallback={<CatchAllNavigate to="/login" />}
    >
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </Layout>
    </Authenticated>
  );
}

function PublicOnly() {
  return (
    <Authenticated key="public-routes" fallback={<Outlet />}>
      <NavigateToResource resource="dashboard" />
    </Authenticated>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<ProtectedLayout />}>
          <Route index element={<NavigateToResource resource="dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />

          {CRUD.map(({ path, list: List, create: Create, edit: Edit, show: Show }) => (
            <Route key={path} path={path}>
              <Route index element={<List />} />
              {Create && <Route path="create" element={<Create />} />}
              {Edit && <Route path="edit/:id" element={<Edit />} />}
              {Show && <Route path="show/:id" element={<Show />} />}
            </Route>
          ))}

          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<PublicOnly />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
