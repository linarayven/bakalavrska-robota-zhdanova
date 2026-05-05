import { createFileRoute } from "@tanstack/react-router";
import { useTodo } from "@/todo/controller";
import { QuickAdd } from "@/components/planner/QuickAdd";
import { TaskRow } from "@/components/planner/TaskRow";
import { Search } from "lucide-react";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Tasks — Smart Task Planner" }, { name: "description", content: "Browse, filter and manage all your tasks." }] }),
  component: TasksPage,
});

function TasksPage() {
  const c = useTodo();
  const filters: { id: typeof c.filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: c.stats.all },
    { id: "active", label: "Active", count: c.stats.active },
    { id: "completed", label: "Completed", count: c.stats.completed },
  ];
  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4 sm:p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <p className="text-sm text-muted-foreground">Capture, filter and complete your work.</p>
      </header>

      <QuickAdd />

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border bg-card p-2 shadow-sm">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={c.search} onChange={(e) => c.setSearch(e.target.value)} placeholder="Search tasks…"
            className="h-9 w-full rounded-lg bg-muted/40 pl-9 pr-3 text-sm outline-none focus:bg-background focus:ring-2 focus:ring-ring" />
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-muted/40 p-1">
          {filters.map((f) => (
            <button key={f.id} onClick={() => c.setFilter(f.id)}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition ${c.filter === f.id ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {f.label}<span className="rounded bg-muted/60 px-1 text-[10px]">{f.count}</span>
            </button>
          ))}
        </div>
        <select value={c.filterCategory} onChange={(e) => c.setFilterCategory(e.target.value as any)} className="h-9 rounded-lg border bg-background px-2 text-xs">
          <option value="all">All categories</option>
          {c.categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <select value={c.filterPriority} onChange={(e) => c.setFilterPriority(e.target.value as any)} className="h-9 rounded-lg border bg-background px-2 text-xs">
          <option value="all">All priorities</option>
          <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
        </select>
      </div>

      {c.filteredTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-muted/20 p-10 text-center text-sm text-muted-foreground">No tasks match your filters.</div>
      ) : (
        <div className="space-y-2">
          {c.filteredTasks.map((t) => <TaskRow key={t.id} task={t} />)}
        </div>
      )}
    </div>
  );
}
