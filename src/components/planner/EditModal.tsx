import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Task, Priority, Status } from "@/todo/model";
import { useTodo } from "@/todo/controller";
import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EditModal() {
  const c = useTodo();
  const task = c.selectedTask;
  if (!task) return null;
  return (
    <Inner
      key={task.id}
      task={task}
      onClose={() => c.setModalTaskId(null)}
      onSave={(t) => {
        c.updateTask(t);
        c.setModalTaskId(null);
      }}
    />
  );
}

function Inner({
  task,
  onClose,
  onSave,
}: {
  task: Task;
  onClose: () => void;
  onSave: (t: Task) => void;
}) {
  const { t } = useTranslation();
  const c = useTodo();
  const [draft, setDraft] = useState<Task>(task);
  const set = <K extends keyof Task>(k: K, v: Task[K]) => setDraft((p) => ({ ...p, [k]: v }));
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-base font-semibold">{t("editModal.title")}</h3>
          <button onClick={onClose} className="rounded-md p-1.5 hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3 p-4">
          <label className="block text-xs font-medium text-muted-foreground">
            {t("editModal.fields.title")}
            <input
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            {t("editModal.fields.description")}
            <textarea
              rows={3}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={draft.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-medium text-muted-foreground">
              {t("editModal.fields.dueDate")}
              <input
                type="date"
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={draft.dueDate ?? ""}
                onChange={(e) => set("dueDate", e.target.value || undefined)}
              />
            </label>
            <label className="block text-xs font-medium text-muted-foreground">
              {t("editModal.fields.category")}
              <select
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={draft.categoryId ?? ""}
                onChange={(e) => set("categoryId", e.target.value)}
              >
                {c.categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-medium text-muted-foreground">
              {t("editModal.fields.priority")}
              <select
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={draft.priority}
                onChange={(e) => set("priority", e.target.value as Priority)}
              >
                <option value="low">{t("editModal.priorityOptions.low")}</option>
                <option value="medium">{t("editModal.priorityOptions.medium")}</option>
                <option value="high">{t("editModal.priorityOptions.high")}</option>
              </select>
            </label>
            <label className="block text-xs font-medium text-muted-foreground">
              {t("editModal.fields.status")}
              <select
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={draft.status}
                onChange={(e) => set("status", e.target.value as Status)}
              >
                <option value="to do">{t("editModal.statusOptions.todo")}</option>
                <option value="in progress">{t("editModal.statusOptions.inProgress")}</option>
                <option value="done">{t("editModal.statusOptions.done")}</option>
              </select>
            </label>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 border-t p-4">
          <Button
            variant="destructive"
            onClick={() => {
              c.deleteTask(task.id);
              onClose();
            }}
          >
            <Trash2 className="h-4 w-4" /> {t("editModal.actions.delete")}
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onClose}>
              {t("editModal.actions.cancel")}
            </Button>
            <Button onClick={() => onSave(draft)}>{t("editModal.actions.save")}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
