export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  issueType: "Task" | "Bug" | "Story";
  assignee?: string;
  dueDate?: string;
  status: "to do" | "in progress" | "done";
  createdAt: number;
  categoryId?: string;
  templateId?: string;
}

export type FilterType = "all" | "active" | "completed";
export type Priority = Task["priority"];
export type IssueType = Task["issueType"];
export type Status = Task["status"];

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "study", name: "Study", color: "var(--info)", icon: "GraduationCap" },
  { id: "work", name: "Work", color: "var(--primary)", icon: "Briefcase" },
  { id: "personal", name: "Personal", color: "var(--success)", icon: "Heart" },
  { id: "ideas", name: "Ideas", color: "var(--warning)", icon: "Lightbulb" },
];
