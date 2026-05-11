import { createFileRoute } from "@tanstack/react-router";
import { useTheme, useTodo } from "@/todo/controller";
import { useTranslation } from "react-i18next";
import { Moon, Sun, Bell, Trash2 } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Smart Task Planner" },
      { name: "description", content: "Customize the look and feel of your planner." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [mode, setMode] = useTheme();
  const c = useTodo();
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">{t("settings.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("settings.description")}</p>
      </header>

      <Section title={t("settings.appearance.title")} desc={t("settings.appearance.desc")}>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("light")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium transition ${mode === "light" ? "border-primary bg-primary/5" : "hover:bg-muted"}`}
          >
            <Sun className="h-4 w-4" /> {t("settings.light")}
          </button>
          <button
            onClick={() => setMode("dark")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium transition ${mode === "dark" ? "border-primary bg-primary/5" : "hover:bg-muted"}`}
          >
            <Moon className="h-4 w-4" /> {t("settings.dark")}
          </button>
        </div>
      </Section>

      <Section title={t("settings.categories.title")} desc={t("settings.categories.desc")}>
        <div className="space-y-2">
          {c.categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between rounded-lg border bg-card p-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ background: cat.color }} />
                <span className="text-sm font-medium">{t(`categories.${cat.id}`, { defaultValue: cat.name })}</span>
                <span className="text-xs text-muted-foreground">
                  {c.tasks.filter((t) => t.categoryId === cat.id).length} {c.tasks.filter((t) => t.categoryId === cat.id).length === 1 ? t("settings.tasks.one") : t("settings.tasks.other")}
                </span>
              </div>
              <button
                onClick={() => c.deleteCategory(cat.id)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t("settings.notifications.title")} desc={t("settings.notifications.desc")}>
        <label className="flex items-center justify-between rounded-lg border bg-card p-4 text-sm">
          <span className="inline-flex items-center gap-2">
            <Bell className="h-4 w-4" /> {t("settings.notifications.daily_summary")}
          </span>
          <input type="checkbox" defaultChecked className="h-4 w-4 accent-[color:var(--primary)]" />
        </label>
      </Section>
    </div>
  );
}

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      {children}
    </section>
  );
}
