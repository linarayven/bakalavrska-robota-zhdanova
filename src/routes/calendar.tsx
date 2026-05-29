import { createFileRoute } from "@tanstack/react-router";
import { useTodo } from "@/todo/controller";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { Task } from "@/todo/model";
import { toLocalDateString } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Smart Task Planner" },
      { name: "description", content: "See your tasks scheduled across the month." },
    ],
  }),
  component: CalendarPage,
});

const prioColor: Record<Task["priority"], string> = {
  low: "var(--priority-low)",
  medium: "var(--priority-medium)",
  high: "var(--priority-high)",
};

function CalendarPage() {
  const c = useTodo();
  const { t, i18n } = useTranslation();
  const locale = i18n.language || undefined;
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
      new Date(1970, 0, 4 + index),
    ),
  );
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0 sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const today = toLocalDateString(new Date());

  const move = (delta: number) => {
    const d = new Date(cursor);
    d.setMonth(d.getMonth() + delta);
    setCursor(d);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-4 sm:p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("calendar.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("calendar.description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => move(-1)} className="rounded-md border p-1.5 hover:bg-muted">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="min-w-35 text-center text-sm font-semibold">
            {cursor.toLocaleDateString(locale, { month: "long", year: "numeric" })}
          </div>
          <button onClick={() => move(1)} className="rounded-md border p-1.5 hover:bg-muted">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="grid grid-cols-7 border-b bg-muted/30 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {weekdays.map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((d, i) => {
            if (!d) return <div key={i} className="min-h-25 border-b border-r bg-muted/10" />;
            const iso = toLocalDateString(d);
            const items = c.tasks.filter((t) => t.dueDate === iso);
            const isToday = iso === today;
            return (
              <div key={i} className="min-h-25 border-b border-r p-1.5 last:border-r-0">
                <div
                  className={`mb-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-medium ${isToday ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  {d.getDate()}
                </div>
                <div className="space-y-1">
                  {items.slice(0, 3).map((t) => (
                    <div
                      key={t.id}
                      className="group relative rounded px-1.5 py-0.5 text-[10px] font-medium transition hover:bg-muted/20"
                    >
                      <button
                        type="button"
                        onClick={() => c.setModalTaskId(t.id)}
                        className="w-full text-left"
                        style={{
                          color: prioColor[t.priority],
                        }}
                      >
                        {t.title}
                      </button>
                      <div className="absolute right-1 top-1 hidden items-center gap-1 opacity-0 transition-all group-hover:flex">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            c.setModalTaskId(t.id);
                          }}
                          className="rounded-md p-1.5 hover:bg-muted"
                          aria-label="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            c.deleteTask(t.id);
                          }}
                          className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <div className="text-[10px] text-muted-foreground">
                      +{items.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
