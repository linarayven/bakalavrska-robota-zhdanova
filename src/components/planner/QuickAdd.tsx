import { useTodo } from "@/todo/controller";
import { Plus, Calendar, Flag, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const PHRASES = [
  "What's on your mind?",
  "What are we doing today?",
  "Any new tasks?",
  "What's next on the list?",
  "Capture a quick thought…",
  "Plan your next move…",
];

function useTypingPlaceholder(active: boolean) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!active) { setText(""); return; }
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const phrase = PHRASES[phraseIdx];
      if (!deleting) {
        charIdx++;
        setText(phrase.slice(0, charIdx));
        if (charIdx === phrase.length) {
          deleting = true;
          timer = setTimeout(tick, 1800);
          return;
        }
        timer = setTimeout(tick, 55 + Math.random() * 50);
      } else {
        charIdx--;
        setText(phrase.slice(0, charIdx));
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % PHRASES.length;
          timer = setTimeout(tick, 300);
          return;
        }
        timer = setTimeout(tick, 25);
      }
    };
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [active]);
  return text;
}

export function QuickAdd({ compact = false }: { compact?: boolean }) {
  const c = useTodo();
  const placeholder = useTypingPlaceholder(!c.inputValue);
  return (
    <div className="rounded-2xl border bg-card p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
          <Plus className="h-4 w-4" />
        </div>
        <input
          className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
          placeholder={placeholder ? `${placeholder}|` : "\u00a0"}
          value={c.inputValue}
          onChange={(e) => c.setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && c.addTask()}
        />
        <Button size="sm" onClick={() => c.addTask()} disabled={!c.inputValue.trim()}>Add</Button>
      </div>
      {!compact && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t pt-2 text-xs">
          <label className="select-pill inline-flex items-center gap-1.5">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <input type="date" value={c.dueDate ?? ""} onChange={(e) => c.setDueDate(e.target.value || undefined)} className="bg-transparent outline-none" />
          </label>
          <div className="select-pill inline-flex items-center gap-1.5">
            <Flag className="h-3 w-3 text-muted-foreground" />
            <select value={c.priority} onChange={(e) => c.setPriority(e.target.value as any)} className="bg-transparent outline-none capitalize">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="select-pill inline-flex items-center gap-1.5">
            <Tag className="h-3 w-3 text-muted-foreground" />
            <select value={c.categoryId} onChange={(e) => c.setCategoryId(e.target.value)} className="bg-transparent outline-none">
              {c.categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
