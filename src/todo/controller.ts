import { useEffect, useState, useMemo } from "react";
import { toLocalDateString } from "@/lib/utils";
import type { Task, FilterType, Priority, IssueType, Status, Category } from "./model";
import { DEFAULT_CATEGORIES } from "./model";

const STORAGE_KEY = "stp.tasks";
const CATEGORIES_KEY = "stp.categories";
const THEME_KEY = "stp.theme";
const LANGUAGE_KEY = "stp.language";

function loadTasks(language: Language): Task[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return seedTasks(language);
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return seedTasks(language);
    return parsed.map((t: unknown) => {
      const item = t as Record<string, unknown>;
      const completedFlag = typeof item.completed === "boolean" ? item.completed : false;
      let statusValue: Status = "to do";
      if (typeof item.status === "string") {
        statusValue = item.status as Status;
      } else if (completedFlag) {
        statusValue = "done";
      }

      let title: string;
      if (typeof item.title === "string") {
        title = item.title;
      } else if (typeof item.summary === "string") {
        title = item.summary;
      } else {
        title = "(No title)";
      }
      const description = typeof item.description === "string" ? item.description : "";
      const priority = typeof item.priority === "string" ? (item.priority as Priority) : "medium";
      const issueType = typeof item.issueType === "string" ? (item.issueType as IssueType) : "Task";
      const assignee = typeof item.assignee === "string" ? item.assignee : undefined;
      const dueDate = typeof item.dueDate === "string" ? item.dueDate : undefined;
      const createdAt = typeof item.createdAt === "number" ? item.createdAt : Date.now();
      const categoryId = typeof item.categoryId === "string" ? item.categoryId : "personal";
      const templateId = typeof item.templateId === "string" ? item.templateId : undefined;
      return {
        id: typeof item.id === "number" ? item.id : Date.now(),
        title,
        description,
        completed: statusValue === "done" ? true : completedFlag,
        priority,
        issueType,
        assignee,
        dueDate,
        status: statusValue,
        createdAt,
        categoryId,
        templateId,
      } as Task;
    });
  } catch (e) {
    console.error("Failed to load tasks", e);
    return seedTasks(language);
  }
}

function seedTasks(language: Language): Task[] {
  const today = new Date();
  const iso = (d: Date) => toLocalDateString(d);
  const plus = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return iso(d);
  };

  const seedData =
    language === "uk"
      ? [
          {
            id: 1,
            title: "Прочитати розділ 4 - Лінійна алгебра",
            priority: "high" as const,
            issueType: "Task" as const,
            status: "in progress" as const,
            completed: false,
            dueDate: plus(30),
            categoryId: "study",
            createdAt: Date.now() - 10000,
            templateId: "study-linear-algebra",
          },
          {
            id: 2,
            title: "Надіслати завдання по UX",
            priority: "high" as const,
            issueType: "Task" as const,
            status: "to do" as const,
            completed: false,
            dueDate: plus(31),
            categoryId: "study",
            createdAt: Date.now() - 9000,
            templateId: "submit-ux-assignment",
          },
          {
            id: 3,
            title: "Тренування в залі",
            priority: "low" as const,
            issueType: "Task" as const,
            status: "to do" as const,
            completed: false,
            dueDate: plus(30),
            categoryId: "personal",
            createdAt: Date.now() - 8000,
            templateId: "gym-session",
          },
          {
            id: 4,
            title: "Намалювати ескіз ідеї для цільової сторінки",
            priority: "medium" as const,
            issueType: "Story" as const,
            status: "to do" as const,
            completed: false,
            dueDate: plus(32),
            categoryId: "ideas",
            createdAt: Date.now() - 7000,
            templateId: "sketch-landing-page",
          },
          {
            id: 5,
            title: "Надіслати професору електронного листа щодо дипломної роботи",
            priority: "medium" as const,
            issueType: "Task" as const,
            status: "done" as const,
            completed: true,
            dueDate: plus(29),
            categoryId: "study",
            createdAt: Date.now() - 6000,
            templateId: "email-professor",
          },
          {
            id: 6,
            title: "Запланувати вихідні",
            priority: "low" as const,
            issueType: "Task" as const,
            status: "to do" as const,
            completed: false,
            dueDate: plus(33),
            categoryId: "personal",
            createdAt: Date.now() - 5000,
            templateId: "plan-weekend",
          },
        ]
      : [
          {
            id: 1,
            title: "Read chapter 4 — Linear Algebra",
            priority: "high" as const,
            issueType: "Task" as const,
            status: "in progress" as const,
            completed: false,
            dueDate: plus(30),
            categoryId: "study",
            createdAt: Date.now() - 10000,
            templateId: "study-linear-algebra",
          },
          {
            id: 2,
            title: "Submit UX assignment",
            priority: "high" as const,
            issueType: "Task" as const,
            status: "to do" as const,
            completed: false,
            dueDate: plus(31),
            categoryId: "study",
            createdAt: Date.now() - 9000,
            templateId: "submit-ux-assignment",
          },
          {
            id: 3,
            title: "Gym session",
            priority: "low" as const,
            issueType: "Task" as const,
            status: "to do" as const,
            completed: false,
            dueDate: plus(30),
            categoryId: "personal",
            createdAt: Date.now() - 8000,
            templateId: "gym-session",
          },
          {
            id: 4,
            title: "Sketch landing page idea",
            priority: "medium" as const,
            issueType: "Story" as const,
            status: "to do" as const,
            completed: false,
            dueDate: plus(32),
            categoryId: "ideas",
            createdAt: Date.now() - 7000,
            templateId: "sketch-landing-page",
          },
          {
            id: 5,
            title: "Email professor about thesis",
            priority: "medium" as const,
            issueType: "Task" as const,
            status: "done" as const,
            completed: true,
            dueDate: plus(29),
            categoryId: "study",
            createdAt: Date.now() - 6000,
            templateId: "email-professor",
          },
          {
            id: 6,
            title: "Plan weekend trip",
            priority: "low" as const,
            issueType: "Task" as const,
            status: "to do" as const,
            completed: false,
            dueDate: plus(33),
            categoryId: "personal",
            createdAt: Date.now() - 5000,
            templateId: "plan-weekend",
          },
        ];

  return seedData;
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

export function useTodoController(language: Language) {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks(language));
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Ignore localStorage errors
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch {
      // Ignore localStorage errors
    }
  }, [categories]);

  useEffect(() => {
    setTasks((prev) =>
      prev.map((task) => {
        if (!task.templateId) return task;
        const title = seedTasks(language).find(
          (seed) => seed.templateId === task.templateId,
        )?.title;
        return title ? { ...task, title } : task;
      }),
    );
  }, [language]);

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
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, status: !t.completed ? "done" : "to do" }
          : t,
      ),
    );

  const updateTask = (updated: Task) => {
    const normalized = { ...updated, completed: updated.status === "done" };
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== normalized.id) return t;
        return {
          ...normalized,
          templateId: t.title === normalized.title ? t.templateId : undefined,
        };
      }),
    );
  };

  const setStatus = (id: number, status: Status) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, completed: status === "done" } : t)),
    );

  const addCategory = (name: string, color: string) => {
    const id = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    setCategories((prev) => [...prev, { id, name, color }]);
  };
  const deleteCategory = (id: string) => setCategories((prev) => prev.filter((c) => c.id !== id));

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (filter === "active" && (task.completed || task.status === "done")) return false;
        if (filter === "completed" && !(task.completed || task.status === "done")) return false;
        if (filterCategory !== "all" && task.categoryId !== filterCategory) return false;
        if (filterPriority !== "all" && task.priority !== filterPriority) return false;
        if (search.trim() && !task.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [tasks, filter, filterCategory, filterPriority, search],
  );

  const today = toLocalDateString(new Date());

  const stats = useMemo(
    () => ({
      all: tasks.length,
      active: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
      today: tasks.filter((t) => t.dueDate === today && !t.completed).length,
      overdue: tasks.filter((t) => t.dueDate && t.dueDate < today && !t.completed).length,
    }),
    [tasks, today],
  );

  const selectedTask =
    modalTaskId !== null ? (tasks.find((t) => t.id === modalTaskId) ?? null) : null;

  return {
    tasks,
    categories,
    inputValue,
    setInputValue,
    assignee,
    setAssignee,
    issueType,
    setIssueType,
    filter,
    setFilter,
    priority,
    setPriority,
    dueDate,
    setDueDate,
    categoryId,
    setCategoryId,
    search,
    setSearch,
    filterCategory,
    setFilterCategory,
    filterPriority,
    setFilterPriority,
    modalTaskId,
    setModalTaskId,
    selectedTask,
    addTask,
    deleteTask,
    toggleTask,
    updateTask,
    setStatus,
    addCategory,
    deleteCategory,
    filteredTasks,
    stats,
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

// LANGUAGE
export type Language = "en" | "uk";
export function useLanguage(): [Language, (l: Language) => void] {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem(LANGUAGE_KEY) as Language) || "en";
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(LANGUAGE_KEY, language);
    // Change i18next language - import i18n dynamically to avoid SSR issues
    if (typeof window !== "undefined") {
      import("i18next").then((i18n) => {
        i18n.default.changeLanguage(language);
      });
    }
  }, [language]);
  return [language, setLanguage];
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
