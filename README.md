# Smart Task Planner

**A modern full-stack task management web application** built with React 19, TypeScript, and TanStack Start. Developed as a bachelor's thesis project, Smart Task Planner demonstrates a production-grade approach to state management, UI architecture, and internationalization in a real-world SPA.

> 🚧 Live demo link will be added once deployment is finalized. See [Running Locally](#running-locally) below.

---

## Overview

Smart Task Planner helps users organize, prioritize, and track their daily tasks through multiple complementary views — a statistics-driven Dashboard, a drag-and-drop Kanban board, and a full Calendar view. The application is designed around a clean, accessible interface with dark/light theming and bilingual support (English & Ukrainian), making it suitable for a broad range of users and workflows.

The project was built to explore and apply modern frontend patterns at scale: type-safe forms with schema validation, optimistic UI updates, persistent local state, and a component architecture built on accessible primitives rather than ad-hoc markup.

---

## Key Features

**Task Management**
- Full CRUD operations for tasks, with priority levels (High / Medium / Low) and color-coded categories
- Due date assignment via an integrated date picker
- Status tracking across To Do → In Progress → Done
- Real-time search across all tasks

**Multiple Views**
- **Dashboard** — statistics overview, today's tasks, overdue items, and active task previews
- **Kanban Board** — drag-and-drop status management
- **Calendar** — month view with tasks mapped to their due dates
- **Task List** — detailed, filterable list of all tasks
- **Projects** — project-based task organization
- **Settings** — theme, language, and personalization controls

**User Experience**
- Dark/light theme with persisted preference
- Full English/Ukrainian localization via i18next
- Responsive layout across desktop, tablet, and mobile
- Drag-and-drop interactions, toast notifications (Sonner), and a Quick Add modal for fast task entry
- Keyboard-accessible navigation built on Radix UI primitives

**Architecture & Performance**
- Server/async state managed with TanStack Query
- Global state (tasks, categories, language, theme) via React Context
- Local Storage persistence for offline durability
- Rendering optimized with memoization and isolated state boundaries

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Framework & Routing** | React 19, TanStack Start, TypeScript (strict mode) |
| **UI & Styling** | Tailwind CSS 4, Radix UI, Lucide React, CVA, Embla Carousel, Sonner |
| **Forms & Validation** | React Hook Form, Zod, @hookform/resolvers |
| **State & Data** | TanStack React Query, React Context, i18next |
| **Tooling** | Vite 7, Bun, ESLint + Prettier, TypeScript ESLint |
| **Deployment** | Cloudflare Workers (Wrangler), GitHub Pages CI/CD |

---

## Project Structure

```
smart-task-planner/
├── src/
│   ├── components/       # Reusable UI components (Radix-based primitives, cards, modals)
│   ├── routes/            # TanStack Router route definitions
│   ├── context/            # Global state providers (tasks, theme, language)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                 # Utilities, schema validators, helpers
│   ├── locales/            # i18next translation files (en, uk)
│   ├── types/               # Shared TypeScript types
│   └── styles/              # Tailwind configuration and global styles
├── public/
├── wrangler.toml           # Cloudflare deployment configuration
└── vite.config.ts
```

---

## Running Locally

```bash
# Clone the repository
git clone https://github.com/linarayven/bakalavrska-robota-zhdanova.git
cd bakalavrska-robota-zhdanova

# Install dependencies
bun install

# Start the dev server
bun dev
```

The app will be available at `http://localhost:5173` (or the port shown in your terminal).

---

## About the Project

Smart Task Planner was developed as part of a bachelor's thesis in Computer Science, with a focus on applying modern SPA architecture patterns to a practical, everyday productivity tool. The project covers the full development lifecycle — from requirements and UX design to implementation, state management architecture, and deployment.
