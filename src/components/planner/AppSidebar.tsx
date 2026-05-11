import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ListChecks,
  FolderKanban,
  Columns3,
  CalendarDays,
  Settings,
  Sparkles,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTodo } from "@/todo/controller";
import { useTranslation } from "react-i18next";

const items = [
  { titleKey: "navigation.dashboard", url: "/", icon: LayoutDashboard },
  { titleKey: "navigation.tasks", url: "/tasks", icon: ListChecks },
  { titleKey: "navigation.projects", url: "/projects", icon: FolderKanban },
  { titleKey: "navigation.board", url: "/board", icon: Columns3 },
  { titleKey: "navigation.calendar", url: "/calendar", icon: CalendarDays },
  { titleKey: "navigation.settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { stats } = useTodo();
  const { t } = useTranslation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl shadow-md"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight">{t("app.title")}</div>
              <div className="text-[11px] text-muted-foreground">{t("app.subtitle")}</div>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar.workspace")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = item.url === "/" ? path === "/" : path.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{t(item.titleKey)}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {!collapsed && (
        <SidebarFooter>
          <div className="m-2 rounded-xl border bg-card p-3 text-xs">
            <div className="mb-2 font-semibold">{t("stats.today")}</div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("stats.pending")}</span>
              <span className="font-semibold">{stats.today}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("stats.overdue")}</span>
              <span className="font-semibold text-destructive">{stats.overdue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("stats.done")}</span>
              <span className="font-semibold" style={{ color: "var(--success)" }}>
                {stats.completed}
              </span>
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
