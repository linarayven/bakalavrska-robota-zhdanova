import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/planner/AppSidebar";
import { TodoProvider } from "@/todo/TodoProvider";
import { EditModal } from "@/components/planner/EditModal";
import { useTheme, useLanguage } from "@/todo/controller";
import { Moon, Sun, Search, Languages } from "lucide-react";
import { useTodo } from "@/todo/controller";
import { useTranslation } from "react-i18next";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Smart Task Planner" },
      { name: "description", content: "Plan your day, organize projects, and stay productive." },
      { property: "og:title", content: "Smart Task Planner" },
      { name: "twitter:title", content: "Smart Task Planner" },
      {
        property: "og:description",
        content: "Plan your day, organize projects, and stay productive.",
      },
      {
        name: "twitter:description",
        content: "Plan your day, organize projects, and stay productive.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b57df5ef-1998-4821-819f-bfda4fa01009/id-preview-88bfd819--7f45b8db-17fe-46f7-95f3-243c0f651236.lovable.app-1777992083219.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b57df5ef-1998-4821-819f-bfda4fa01009/id-preview-88bfd819--7f45b8db-17fe-46f7-95f3-243c0f651236.lovable.app-1777992083219.png",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <TodoProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar />
            <main className="flex-1 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
        <EditModal />
      </SidebarProvider>
    </TodoProvider>
  );
}

function Topbar() {
  const [mode, setMode] = useTheme();
  const [language, setLanguage] = useLanguage();
  const c = useTodo();
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur-md">
      <SidebarTrigger />
      <div className="relative ml-2 hidden flex-1 max-w-md sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={c.search}
          onChange={(e) => c.setSearch(e.target.value)}
          placeholder={t("search.placeholder")}
          className="h-9 w-full rounded-lg border bg-muted/50 pl-9 pr-3 text-sm outline-none focus:bg-background focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setLanguage(language === "en" ? "uk" : "en")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-muted"
          aria-label="Toggle language"
        >
          <Languages className="h-4 w-4" />
        </button>
        <button
          onClick={() => setMode(mode === "dark" ? "light" : "dark")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-muted"
          aria-label="Toggle theme"
        >
          {mode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
