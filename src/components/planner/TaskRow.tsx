import { Task } from "@/todo/model";
import { useTodo } from "@/todo/controller";
import { Calendar, Trash2, Pencil, Flag, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import type { Status } from "@/todo/model";

const prioColor = {
  low: "var(--priority-low)",
  medium: "var(--priority-medium)",
  high: "var(--priority-high)",
} as const;

export function TaskRow({ task }: { task: Task }) {
  const c = useTodo();
  const { t } = useTranslation();
  const cat = c.categories.find((x) => x.id === task.categoryId);
  const overdue =
    task.dueDate && task.dueDate < new Date().toISOString().slice(0, 10) && !task.completed;
  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm transition-all hover:shadow-md",
        task.completed && "opacity-60",
      )}
      style={{ borderLeftColor: prioColor[task.priority], borderLeftWidth: 3 }}
    >
      <button
        onClick={() => c.toggleTask(task.id)}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
          task.completed
            ? "border-transparent bg-primary text-primary-foreground"
            : "border-muted-foreground/40 hover:border-primary",
        )}
        aria-label="Toggle complete"
      >
        {task.completed && (
          <svg
            viewBox="0 0 12 12"
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M2 6l3 3 5-6" />
          </svg>
        )}
      </button>
      <div className="min-w-0 flex-1">
        <div className={cn("truncate text-sm font-medium", task.completed && "line-through")}>
          {task.title}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          {cat && (
            <span
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5"
              style={{
                background: `color-mix(in oklab, ${cat.color} 15%, transparent)`,
                color: cat.color,
              }}
            >
              <Tag className="h-2.5 w-2.5" />
              {cat.name}
            </span>
          )}
          {task.dueDate && (
            <span
              className={cn(
                "inline-flex items-center gap-1",
                overdue && "text-destructive font-medium",
              )}
            >
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
          <select
            className="select-pill"
            value={task.status}
            onChange={(e) => c.setStatus(task.id, e.target.value as Status)}
          >
            <option value="to do">{t("status.to_do")}</option>
            <option value="in progress">{t("status.in_progress")}</option>
            <option value="done">{t("status.completed")}</option>
          </select>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => c.setModalTaskId(task.id)}
          className="rounded-md p-1.5 hover:bg-muted"
          aria-label="Edit"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => c.deleteTask(task.id)}
          className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"
          aria-label="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
