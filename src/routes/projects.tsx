import { createFileRoute, Link } from "@tanstack/react-router";
import { useTodo } from "@/todo/controller";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FolderKanban, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Smart Task Planner" },
      { name: "description", content: "Organize tasks into flexible categories and projects." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const c = useTodo();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const palette = [
    "oklch(0.62 0.19 270)", // indigo
    "oklch(0.66 0.18 200)", // teal
    "oklch(0.7 0.16 155)", // green
    "oklch(0.78 0.15 75)", // amber
    "oklch(0.68 0.21 25)", // coral
    "oklch(0.65 0.22 350)", // pink
    "oklch(0.6 0.2 305)", // violet
    "oklch(0.55 0.05 260)", // slate
  ];
  const [color, setColor] = useState(palette[0]);
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">{t("projects.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("projects.description")}</p>
      </header>

      <div className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("projects.new_category_placeholder")}
            className="h-9 flex-1 min-w-[160px] rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="flex flex-wrap items-center gap-1.5">
            {palette.map((p) => (
              <button
                key={p}
                onClick={() => setColor(p)}
                aria-label="Pick color"
                className={`h-6 w-6 rounded-full transition-transform hover:scale-110 ${color === p ? "ring-2 ring-offset-2 ring-offset-background ring-foreground" : ""}`}
                style={{ background: p }}
              />
            ))}
          </div>
          <Button
            onClick={() => {
              if (name.trim()) {
                c.addCategory(name.trim(), color);
                setName("");
              }
            }}
          >
            <Plus className="h-4 w-4" /> {t("projects.add")}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {c.categories.map((cat) => {
          const items = c.tasks.filter((t) => t.categoryId === cat.id);
          const done = items.filter((t) => t.completed).length;
          const pct = items.length ? (done / items.length) * 100 : 0;
          return (
            <div
              key={cat.id}
              className="group rounded-2xl border bg-card p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      background: `color-mix(in oklab, ${cat.color} 18%, transparent)`,
                      color: cat.color,
                    }}
                  >
                    <FolderKanban className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{t(`categories.${cat.id}`, { defaultValue: cat.name })}</div>
                    <div className="text-xs text-muted-foreground">
                      {items.length} {items.length === 1 ? t("settings.tasks.one") : t("settings.tasks.other")}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => c.deleteCategory(cat.id)}
                  className="rounded-md p-1.5 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: cat.color }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{done} done</span>
                <Link
                  to="/tasks"
                  onClick={() => c.setFilterCategory(cat.id)}
                  className="font-medium text-foreground hover:underline"
                >
                  {t("actions.open")}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
