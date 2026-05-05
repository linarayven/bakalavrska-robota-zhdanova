import { ReactNode } from "react";
import { TodoContext, useTodoController } from "./controller";

export function TodoProvider({ children }: { children: ReactNode }) {
  const value = useTodoController();
  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}
