import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider, { UnsavedChangesNotifier } from "@refinedev/react-router";
import { RouterProvider } from "@heroui/react";
import { BrowserRouter, useHref, useNavigate } from "react-router";

import { authProvider } from "@providers/auth-provider";
import { dataProvider } from "@providers/data-provider";
import { DevtoolsProvider, NotificationProvider, notificationProvider } from "@providers";
import { resources } from "@routes/resources";
import { AppRoutes } from "@routes/AppRoutes";
import { DocumentTitleHandler } from "@components/document-title-handler";
import { LookupOptionsProvider } from "@contexts/lookupOptions";

/**
 * Lets HeroUI / React Aria links (e.g. `<Dropdown.Item href>`) navigate
 * client-side through React Router instead of reloading the page.
 */
function HeroUIRouter({ children }: React.PropsWithChildren) {
  const navigate = useNavigate();
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      {children}
    </RouterProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <HeroUIRouter>
        <NotificationProvider />
        <RefineKbarProvider>
          <DevtoolsProvider>
            <Refine
              routerProvider={routerProvider}
              dataProvider={dataProvider}
              notificationProvider={notificationProvider}
              authProvider={authProvider}
              resources={resources}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "uSCaaK-RG5u1x-E6CnXU",
              }}
            >
              <LookupOptionsProvider>
                <AppRoutes />
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </LookupOptionsProvider>
            </Refine>
          </DevtoolsProvider>
        </RefineKbarProvider>
      </HeroUIRouter>
    </BrowserRouter>
  );
}
