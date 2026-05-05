import { useEffect, useState, useMemo } from "react";
import type { Task, FilterType, Priority, IssueType, Status, Category } from "./model";
import { DEFAULT_CATEGORIES } from "./model";

const STORAGE_KEY = "stp.tasks";
const CATEGORIES_KEY = "stp.categories";
const THEME_KEY = "stp.theme";

function loadTasks(): Task[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return seedTasks();
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((t: any) => {
      const completedFlag = typeof t.completed === "boolean" ? t.completed : false;
      const statusValue: Status = t.status ?? (completedFlag ? "done" : "to do");
      return {
        id: t.id ?? Date.now(),
        title: t.title ?? t.summary ?? "(No title)",
        description: t.description ?? "",
        completed: statusValue === "done" ? true : completedFlag,
        priority: t.priority ?? "medium",
        issueType: t.issueType ?? "Task",
        assignee: t.assignee ?? undefined,
        dueDate: t.dueDate ?? undefined,
        status: statusValue,
        createdAt: t.createdAt ?? Date.now(),
        categoryId: t.categoryId ?? "personal",
      } as Task;
    });
  } catch (e) {
    console.error("Failed to load tasks", e);
    return [];
  }
}

function seedTasks(): Task[] {
  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const plus = (n: number) => { const d = new Date(today); d.setDate(d.getDate() + n); return iso(d); };
  return [
    { id: 1, title: "Read chapter 4 — Linear Algebra", priority: "high", issueType: "Task", status: "in progress", completed: false, dueDate: iso(today), categoryId: "study", createdAt: Date.now() - 10000 },
    { id: 2, title: "Submit UX assignment", priority: "high", issueType: "Task", status: "to do", completed: false, dueDate: plus(1), categoryId: "study", createdAt: Date.now() - 9000 },
    { id: 3, title: "Gym session", priority: "low", issueType: "Task", status: "to do", completed: false, dueDate: iso(today), categoryId: "personal", createdAt: Date.now() - 8000 },
    { id: 4, title: "Sketch landing page idea", priority: "medium", issueType: "Story", status: "to do", completed: false, dueDate: plus(2), categoryId: "ideas", createdAt: Date.now() - 7000 },
    { id: 5, title: "Email professor about thesis", priority: "medium", issueType: "Task", status: "done", completed: true, dueDate: plus(-1), categoryId: "study", createdAt: Date.now() - 6000 },
    { id: 6, title: "Plan weekend trip", priority: "low", issueType: "Task", status: "to do", completed: false, dueDate: plus(4), categoryId: "personal", createdAt: Date.now() - 5000 },
  ];
}

function loadCategories(): Category[] {
  try {
    const saved = localStorage.getItem(CATEGORIES_KEY);
    if (!saved) return DEFAULT_CATEGORIES;
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_CATEGORIES;
    return parsed;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function useTodoController() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [categories, setCategories] = useState<Category[]>(() => loadCategories());
  const [inputValue, setInputValue] = useState("");
  const [assignee, setAssignee] = useState("");
  const [issueType, setIssueType] = useState<IssueType>("Task");
  const [filter, setFilter] = useState<FilterType>("all");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string>("personal");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | "all">("all");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [modalTaskId, setModalTaskId] = useState<number | null>(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch {}
  }, [tasks]);

  useEffect(() => {
    try { localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories)); } catch {}
  }, [categories]);

  const addTask = (titleArg?: string, opts?: Partial<Task>) => {
    const title = (titleArg ?? inputValue).trim();
    if (!title) return;
    const newTask: Task = {
      id: Date.now(),
      title,
      description: "",
      completed: false,
      priority,
      issueType,
      assignee: assignee || undefined,
      dueDate: dueDate || undefined,
      status: "to do",
      createdAt: Date.now(),
      categoryId,
      ...opts,
    };
    setTasks((prev) => [newTask, ...prev]);
    setInputValue("");
  };

  const deleteTask = (id: number) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const toggleTask = (id: number) =>
    setTasks((prev) => prev.map((t) =>
      t.id === id ? { ...t, completed: !t.completed, status: !t.completed ? "done" : "to do" } : t
    ));

  const updateTask = (updated: Task) => {
    const normalized = { ...updated, completed: updated.status === "done" };
    setTasks((prev) => prev.map((t) => (t.id === normalized.id ? normalized : t)));
  };

  const setStatus = (id: number, status: Status) =>
    setTasks((prev) => prev.map((t) =>
      t.id === id ? { ...t, status, completed: status === "done" } : t
    ));

  const addCategory = (name: string, color: string) => {
    const id = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    setCategories((prev) => [...prev, { id, name, color }]);
  };
  const deleteCategory = (id: string) => setCategories((prev) => prev.filter((c) => c.id !== id));

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    if (filter === "active" && (task.completed || task.status === "done")) return false;
    if (filter === "completed" && !(task.completed || task.status === "done")) return false;
    if (filterCategory !== "all" && task.categoryId !== filterCategory) return false;
    if (filterPriority !== "all" && task.priority !== filterPriority) return false;
    if (search.trim() && !task.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [tasks, filter, filterCategory, filterPriority, search]);

  const stats = useMemo(() => ({
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
    today: tasks.filter((t) => t.dueDate === new Date().toISOString().slice(0, 10) && !t.completed).length,
    overdue: tasks.filter((t) => t.dueDate && t.dueDate < new Date().toISOString().slice(0, 10) && !t.completed).length,
  }), [tasks]);

  const selectedTask =
    modalTaskId !== null ? tasks.find((t) => t.id === modalTaskId) ?? null : null;

  return {
    tasks, categories,
    inputValue, setInputValue,
    assignee, setAssignee,
    issueType, setIssueType,
    filter, setFilter,
    priority, setPriority,
    dueDate, setDueDate,
    categoryId, setCategoryId,
    search, setSearch,
    filterCategory, setFilterCategory,
    filterPriority, setFilterPriority,
    modalTaskId, setModalTaskId,
    selectedTask,
    addTask, deleteTask, toggleTask, updateTask, setStatus,
    addCategory, deleteCategory,
    filteredTasks, stats,
  };
}

// THEME
export type ThemeMode = "light" | "dark";
export function useTheme(): [ThemeMode, (m: ThemeMode) => void] {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem(THEME_KEY) as ThemeMode) || "light";
  });
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", mode === "dark");
    localStorage.setItem(THEME_KEY, mode);
  }, [mode]);
  return [mode, setMode];
}

// Global store via context — single source of truth across routes
import { createContext, useContext } from "react";
export const TodoContext = createContext<ReturnType<typeof useTodoController> | null>(null);
export function useTodo() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodo must be inside TodoProvider");
  return ctx;
}

export type TodoController = ReturnType<typeof useTodoController>;
