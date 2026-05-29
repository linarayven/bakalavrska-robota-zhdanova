import { createFileRoute } from "@tanstack/react-router";
import { useTodo } from "@/todo/controller";
import { Task } from "@/todo/model";
import { Calendar, Flag, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export const Route = createFileRoute("/board")({
  head: () => ({
    meta: [
      { title: "Board — Smart Task Planner" },
      { name: "description", content: "Visualize your workflow with a simple Kanban board." },
    ],
  }),
  component: BoardPage,
});

const COLS: { key: Task["status"]; title: string; tint: string }[] = [
  { key: "to do", title: "status.to_do", tint: "var(--info)" },
  { key: "in progress", title: "status.in_progress", tint: "var(--warning)" },
  { key: "done", title: "status.completed", tint: "var(--success)" },
];

const prioColor: Record<Task["priority"], string> = {
  low: "var(--priority-low)",
  medium: "var(--priority-medium)",
  high: "var(--priority-high)",
};

function BoardPage() {
  const c = useTodo();
  const { t } = useTranslation();
  const [dragId, setDragId] = useState<number | null>(null);
  return (
    <div className="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">{t("board.title")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("board.description")}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {COLS.map((col) => {
          const items = c.tasks.filter((task) => task.status === col.key);
          return (
            <div
              key={col.key}
              className="flex min-h-[400px] flex-col rounded-2xl border bg-muted/20 p-3"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragId !== null) {
                  c.setStatus(dragId, col.key);
                  setDragId(null);
                }
              }}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: col.tint }} />
                  <h3 className="text-sm font-semibold">{t(col.title)}</h3>
                  <span className="rounded bg-background px-1.5 text-[11px] text-muted-foreground">
                    {items.length}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {items.map((task) => {
                  const cat = c.categories.find((x) => x.id === task.categoryId);
                  return (
                    <article
                      key={task.id}
                      draggable
                      onDragStart={() => setDragId(task.id)}
                      onClick={() => c.setModalTaskId(task.id)}
                      className="group relative cursor-grab rounded-xl border bg-card p-3 shadow-sm transition hover:shadow-md active:cursor-grabbing"
                      style={{ borderTopColor: prioColor[task.priority], borderTopWidth: 3 }}
                    >
                      <div className="absolute right-3 top-3 hidden items-center gap-1 opacity-0 transition-all group-hover:flex">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            c.setModalTaskId(task.id);
                          }}
                          className="rounded-md p-1.5 hover:bg-muted"
                          aria-label="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            c.deleteTask(task.id);
                          }}
                          className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-sm font-medium">{task.title}</div>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        {cat && (
                          <span
                            className="rounded px-1.5 py-0.5"
                            style={{
                              background: `color-mix(in oklab, ${cat.color} 15%, transparent)`,
                              color: cat.color,
                            }}
                          >
                            {t(`categories.${cat.id}`, { defaultValue: cat.name })}
                          </span>
                        )}
                        {task.dueDate && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 capitalize">
                          <Flag className="h-3 w-3" style={{ color: prioColor[task.priority] }} />
                          {t(`priority.${task.priority}`)}
                        </span>
                      </div>
                    </article>
                  );
                })}
                {items.length === 0 && (
                  <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
                    {t("board.empty")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
