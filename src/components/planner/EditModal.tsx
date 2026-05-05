import { useState } from "react";
import { Task } from "@/todo/model";
import { useTodo } from "@/todo/controller";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EditModal() {
  const c = useTodo();
  const task = c.selectedTask;
  if (!task) return null;
  return <Inner key={task.id} task={task} onClose={() => c.setModalTaskId(null)} onSave={(t) => { c.updateTask(t); c.setModalTaskId(null); }} />;
}

function Inner({ task, onClose, onSave }: { task: Task; onClose: () => void; onSave: (t: Task) => void }) {
  const c = useTodo();
  const [draft, setDraft] = useState<Task>(task);
  const set = <K extends keyof Task>(k: K, v: Task[K]) => setDraft((p) => ({ ...p, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-base font-semibold">Edit task</h3>
          <button onClick={onClose} className="rounded-md p-1.5 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3 p-4">
          <label className="block text-xs font-medium text-muted-foreground">Title
            <input className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" value={draft.title} onChange={(e) => set("title", e.target.value)} />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">Description
            <textarea rows={3} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" value={draft.description ?? ""} onChange={(e) => set("description", e.target.value)} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-medium text-muted-foreground">Due date
              <input type="date" className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" value={draft.dueDate ?? ""} onChange={(e) => set("dueDate", e.target.value || undefined)} />
            </label>
            <label className="block text-xs font-medium text-muted-foreground">Category
              <select className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" value={draft.categoryId ?? ""} onChange={(e) => set("categoryId", e.target.value)}>
                {c.categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </label>
            <label className="block text-xs font-medium text-muted-foreground">Priority
              <select className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" value={draft.priority} onChange={(e) => set("priority", e.target.value as any)}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
            </label>
            <label className="block text-xs font-medium text-muted-foreground">Status
              <select className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" value={draft.status} onChange={(e) => set("status", e.target.value as any)}>
                <option value="to do">To do</option><option value="in progress">In progress</option><option value="done">Done</option>
              </select>
            </label>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t p-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(draft)}>Save changes</Button>
        </div>
      </div>
    </div>
  );
}
