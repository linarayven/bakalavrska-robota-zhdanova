import { createFileRoute } from "@tanstack/react-router";
import { useTodo } from "@/todo/controller";
import { Task } from "@/todo/model";
import { Calendar, Flag } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/board")({
  head: () => ({ meta: [{ title: "Board — Smart Task Planner" }, { name: "description", content: "Visualize your workflow with a simple Kanban board." }] }),
  component: BoardPage,
});

const COLS: { key: Task["status"]; title: string; tint: string }[] = [
  { key: "to do", title: "To do", tint: "var(--info)" },
  { key: "in progress", title: "In progress", tint: "var(--warning)" },
  { key: "done", title: "Done", tint: "var(--success)" },
];

const prioColor: Record<Task["priority"], string> = {
  low: "var(--priority-low)", medium: "var(--priority-medium)", high: "var(--priority-high)",
};

function BoardPage() {
  const c = useTodo();
  const [dragId, setDragId] = useState<number | null>(null);
  return (
    <div className="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Board</h1>
        <p className="text-sm text-muted-foreground">Drag cards across columns to update their status.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {COLS.map((col) => {
          const items = c.tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key}
              className="flex min-h-[400px] flex-col rounded-2xl border bg-muted/20 p-3"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragId !== null) { c.setStatus(dragId, col.key); setDragId(null); } }}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: col.tint }} />
                  <h3 className="text-sm font-semibold">{col.title}</h3>
                  <span className="rounded bg-background px-1.5 text-[11px] text-muted-foreground">{items.length}</span>
                </div>
              </div>
              <div className="space-y-2">
                {items.map((t) => {
                  const cat = c.categories.find((x) => x.id === t.categoryId);
                  return (
                    <article key={t.id}
                      draggable
                      onDragStart={() => setDragId(t.id)}
                      onClick={() => c.setModalTaskId(t.id)}
                      className="cursor-grab rounded-xl border bg-card p-3 shadow-sm transition hover:shadow-md active:cursor-grabbing"
                      style={{ borderTopColor: prioColor[t.priority], borderTopWidth: 3 }}
                    >
                      <div className="text-sm font-medium">{t.title}</div>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        {cat && <span className="rounded px-1.5 py-0.5" style={{ background: `color-mix(in oklab, ${cat.color} 15%, transparent)`, color: cat.color }}>{cat.name}</span>}
                        {t.dueDate && <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(t.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>}
                        <span className="inline-flex items-center gap-1 capitalize"><Flag className="h-3 w-3" style={{ color: prioColor[t.priority] }} />{t.priority}</span>
                      </div>
                    </article>
                  );
                })}
                {items.length === 0 && <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">Drop tasks here</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
