import { toLocalDateString } from "@/lib/utils";
import type { Task } from "./model";
import type { Language } from "./controller";

export function seedTasks(language: Language): Task[] {
  const today = new Date();
  const iso = (d: Date) => toLocalDateString(d);

  const offset = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return iso(d);
  };

  const uk: Task[] = [
    {
      id: 1,
      title: "Прочитати розділ 4 - Лінійна алгебра",
      priority: "high",
      issueType: "Task",
      status: "in progress",
      completed: false,
      dueDate: offset(7),
      categoryId: "study",
      createdAt: Date.now() - 10000,
      templateId: "study-linear-algebra",
    },
    {
      id: 2,
      title: "Надіслати завдання по UX",
      priority: "high",
      issueType: "Task",
      status: "to do",
      completed: false,
      dueDate: offset(0), // сьогодні
      categoryId: "study",
      createdAt: Date.now() - 9000,
      templateId: "submit-ux-assignment",
    },
    {
      id: 3,
      title: "Тренування в залі",
      priority: "low",
      issueType: "Task",
      status: "to do",
      completed: false,
      dueDate: offset(0), // сьогодні
      categoryId: "personal",
      createdAt: Date.now() - 8000,
      templateId: "gym-session",
    },
    {
      id: 4,
      title: "Намалювати ескіз ідеї для цільової сторінки",
      priority: "medium",
      issueType: "Story",
      status: "to do",
      completed: false,
      dueDate: offset(3), // через 3 дні
      categoryId: "ideas",
      createdAt: Date.now() - 7000,
      templateId: "sketch-landing-page",
    },
    {
      id: 5,
      title: "Надіслати професору електронного листа щодо дипломної роботи",
      priority: "medium",
      issueType: "Task",
      status: "done",
      completed: true,
      dueDate: offset(-1), // вчора (виконано)
      categoryId: "study",
      createdAt: Date.now() - 6000,
      templateId: "email-professor",
    },
    {
      id: 6,
      title: "Запланувати вихідні",
      priority: "low",
      issueType: "Task",
      status: "to do",
      completed: false,
      dueDate: offset(14), // через 2 тижні
      categoryId: "personal",
      createdAt: Date.now() - 5000,
      templateId: "plan-weekend",
    },
    {
      id: 7,
      title: "Здати звіт з практики",
      priority: "high",
      issueType: "Task",
      status: "to do",
      completed: false,
      dueDate: offset(-2), // прострочено 2 дні тому
      categoryId: "study",
      createdAt: Date.now() - 4000,
      templateId: "submit-practice-report",
    },
    {
      id: 8,
      title: "Купити подарунок на день народження",
      priority: "medium",
      issueType: "Task",
      status: "to do",
      completed: false,
      dueDate: offset(1), // завтра
      categoryId: "personal",
      createdAt: Date.now() - 3000,
      templateId: "buy-birthday-gift",
    },
    {
      id: 9,
      title: "Підготувати презентацію для захисту",
      priority: "high",
      issueType: "Story",
      status: "in progress",
      completed: false,
      dueDate: offset(30), // через місяць
      categoryId: "study",
      createdAt: Date.now() - 2000,
      templateId: "prepare-defense-presentation",
    },
    {
      id: 10,
      title: "Оновити резюме",
      priority: "medium",
      issueType: "Task",
      status: "to do",
      completed: false,
      dueDate: offset(-3), // прострочено 3 дні тому
      categoryId: "work",
      createdAt: Date.now() - 1000,
      templateId: "update-resume",
    },
  ];

  const en: Task[] = [
    {
      id: 1,
      title: "Read chapter 4 — Linear Algebra",
      priority: "high",
      issueType: "Task",
      status: "in progress",
      completed: false,
      dueDate: offset(7),
      categoryId: "study",
      createdAt: Date.now() - 10000,
      templateId: "study-linear-algebra",
    },
    {
      id: 2,
      title: "Submit UX assignment",
      priority: "high",
      issueType: "Task",
      status: "to do",
      completed: false,
      dueDate: offset(0), // today
      categoryId: "study",
      createdAt: Date.now() - 9000,
      templateId: "submit-ux-assignment",
    },
    {
      id: 3,
      title: "Gym session",
      priority: "low",
      issueType: "Task",
      status: "to do",
      completed: false,
      dueDate: offset(0), // today
      categoryId: "personal",
      createdAt: Date.now() - 8000,
      templateId: "gym-session",
    },
    {
      id: 4,
      title: "Sketch landing page idea",
      priority: "medium",
      issueType: "Story",
      status: "to do",
      completed: false,
      dueDate: offset(3), // in 3 days
      categoryId: "ideas",
      createdAt: Date.now() - 7000,
      templateId: "sketch-landing-page",
    },
    {
      id: 5,
      title: "Email professor about thesis",
      priority: "medium",
      issueType: "Task",
      status: "done",
      completed: true,
      dueDate: offset(-1), // yesterday (done)
      categoryId: "study",
      createdAt: Date.now() - 6000,
      templateId: "email-professor",
    },
    {
      id: 6,
      title: "Plan weekend trip",
      priority: "low",
      issueType: "Task",
      status: "to do",
      completed: false,
      dueDate: offset(14), // in 2 weeks
      categoryId: "personal",
      createdAt: Date.now() - 5000,
      templateId: "plan-weekend",
    },
    {
      id: 7,
      title: "Submit internship report",
      priority: "high",
      issueType: "Task",
      status: "to do",
      completed: false,
      dueDate: offset(-2), // overdue 2 days ago
      categoryId: "study",
      createdAt: Date.now() - 4000,
      templateId: "submit-practice-report",
    },
    {
      id: 8,
      title: "Buy birthday gift",
      priority: "medium",
      issueType: "Task",
      status: "to do",
      completed: false,
      dueDate: offset(1), // tomorrow
      categoryId: "personal",
      createdAt: Date.now() - 3000,
      templateId: "buy-birthday-gift",
    },
    {
      id: 9,
      title: "Prepare defense presentation",
      priority: "high",
      issueType: "Story",
      status: "in progress",
      completed: false,
      dueDate: offset(30), // in a month
      categoryId: "study",
      createdAt: Date.now() - 2000,
      templateId: "prepare-defense-presentation",
    },
    {
      id: 10,
      title: "Update resume",
      priority: "medium",
      issueType: "Task",
      status: "to do",
      completed: false,
      dueDate: offset(-3), // overdue 3 days ago
      categoryId: "work",
      createdAt: Date.now() - 1000,
      templateId: "update-resume",
    },
  ];

  return language === "uk" ? uk : en;
}
