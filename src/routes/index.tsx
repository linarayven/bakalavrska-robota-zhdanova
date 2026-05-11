import { createFileRoute, Link } from "@tanstack/react-router";
import { useTodo } from "@/todo/controller";
import { QuickAdd } from "@/components/planner/QuickAdd";
import { TaskRow } from "@/components/planner/TaskRow";
import { useTranslation } from "react-i18next";
import { CalendarDays, Flame, CheckCircle2, ListTodo, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Smart Task Planner" },
      {
        name: "description",
        content: "Your daily overview: today's tasks, overdue items, and quick capture.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const c = useTodo();
  const { t } = useTranslation();
  const today = new Date().toISOString().slice(0, 10);
  const todays = c.tasks.filter((t) => t.dueDate === today && !t.completed);
  const overdue = c.tasks.filter((t) => t.dueDate && t.dueDate < today && !t.completed);
  const active = c.tasks.find((t) => t.status === "in progress");

  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <Stat
          icon={<ListTodo className="h-4 w-4" />}
          label={t("stats.total")}
          value={c.stats.all}
          tint="var(--info)"
        />
        <Stat
          icon={<CalendarDays className="h-4 w-4" />}
          label={t("stats.today")}
          value={c.stats.today}
          tint="var(--primary)"
        />
        <Stat
          icon={<Flame className="h-4 w-4" />}
          label={t("stats.overdue")}
          value={c.stats.overdue}
          tint="var(--priority-high)"
        />
        <Stat
          icon={<CheckCircle2 className="h-4 w-4" />}
          label={t("stats.done")}
          value={c.stats.completed}
          tint="var(--success)"
        />
      </div>

      <QuickAdd />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-3 lg:col-span-2">
          <SectionHeader
            title={t("stats.today")}
            subtitle={`${todays.length} ${todays.length === 1 ? t("dashboard.tasks_one") : t("dashboard.tasks_other")}`}
            link="/tasks"
          />
          {todays.length === 0 ? (
            <EmptyCard text={t("dashboard.nothing_today")} />
          ) : (
            <div className="space-y-2">
              {todays.map((t) => (
                <TaskRow key={t.id} task={t} />
              ))}
            </div>
          )}

          {overdue.length > 0 && (
            <>
              <SectionHeader
                title={t("stats.overdue")}
                subtitle={`${overdue.length} ${overdue.length === 1 ? t("dashboard.items_one") : t("dashboard.items_other")}`}
                accent="var(--priority-high)"
              />
              <div className="space-y-2">
                {overdue.map((t) => (
                  <TaskRow key={t.id} task={t} />
                ))}
              </div>
            </>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("dashboard.currently_active")}
            </div>
            {active ? (
              <div>
                <div className="text-sm font-semibold">{active.title}</div>
                <div className="mt-1 text-xs text-muted-foreground capitalize">
                  {t(`priority.${active.priority}`)}
                </div>
                <button
                  onClick={() => c.toggleTask(active.id)}
                  className="mt-3 w-full rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  {t("actions.mark_as_done")}
                </button>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                {t("dashboard.no_active")}
              </div>
            )}
          </div>

          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("dashboard.this_week")}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {week.map((d) => {
                const iso = d.toISOString().slice(0, 10);
                const count = c.tasks.filter((t) => t.dueDate === iso && !t.completed).length;
                const isToday = iso === today;
                return (
                  <div
                    key={iso}
                    className={`flex flex-col items-center gap-1 rounded-lg p-1.5 ${isToday ? "bg-primary/10" : ""}`}
                  >
                    <div className="text-[10px] uppercase text-muted-foreground">
                      {d.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 2)}
                    </div>
                    <div className={`text-sm font-semibold ${isToday ? "text-primary" : ""}`}>
                      {d.getDate()}
                    </div>
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${count ? "" : "opacity-0"}`}
                      style={{ background: "var(--primary)" }}
                    />
                    <div className="text-[10px] text-muted-foreground">{count || ""}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  tint,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tint: string;
}) {
  return (
    <div className="rounded-xl border bg-card px-3 py-2.5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-2.5">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `color-mix(in oklab, ${tint} 16%, transparent)`, color: tint }}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-medium text-muted-foreground">{label}</div>
          <div className="text-lg font-bold leading-tight tabular-nums">{value}</div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  link,
  accent,
}: {
  title: string;
  subtitle?: string;
  link?: string;
  accent?: string;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex items-end justify-between pt-2">
      <div>
        <h2
          className="text-base font-semibold tracking-tight"
          style={accent ? { color: accent } : undefined}
        >
          {title}
        </h2>
        {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      </div>
      {link && (
        <Link
          to={link}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          {t("actions.view_all")} <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
