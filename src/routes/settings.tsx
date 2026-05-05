import { createFileRoute } from "@tanstack/react-router";
import { useTheme, useTodo } from "@/todo/controller";
import { Moon, Sun, Bell, Trash2 } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Smart Task Planner" }, { name: "description", content: "Customize the look and feel of your planner." }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [mode, setMode] = useTheme();
  const c = useTodo();
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Personalize your workspace.</p>
      </header>

      <Section title="Appearance" desc="Switch between light and dark theme.">
        <div className="flex gap-2">
          <button onClick={() => setMode("light")} className={`flex flex-1 items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium transition ${mode === "light" ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
            <Sun className="h-4 w-4" /> Light
          </button>
          <button onClick={() => setMode("dark")} className={`flex flex-1 items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium transition ${mode === "dark" ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
            <Moon className="h-4 w-4" /> Dark
          </button>
        </div>
      </Section>

      <Section title="Categories" desc="Manage your project categories.">
        <div className="space-y-2">
          {c.categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between rounded-lg border bg-card p-3">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ background: cat.color }} />
                <span className="text-sm font-medium">{cat.name}</span>
                <span className="text-xs text-muted-foreground">{c.tasks.filter((t) => t.categoryId === cat.id).length} tasks</span>
              </div>
              <button onClick={() => c.deleteCategory(cat.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Notifications" desc="Get reminders for due tasks (concept).">
        <label className="flex items-center justify-between rounded-lg border bg-card p-4 text-sm">
          <span className="inline-flex items-center gap-2"><Bell className="h-4 w-4" /> Daily summary at 9:00</span>
          <input type="checkbox" defaultChecked className="h-4 w-4 accent-[color:var(--primary)]" />
        </label>
      </Section>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
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
