import { ReactNode } from "react";
import { TodoContext, useTodoController, Language } from "./controller";

export function TodoProvider({ children, language }: { children: ReactNode; language: Language }) {
  const value = useTodoController(language);
  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}
