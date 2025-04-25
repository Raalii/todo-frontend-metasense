"use client";

import {
  Command,
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import { useFilteredTasks } from "@/src/hooks/useFilteredTasks";
import Fuse from "fuse.js";
import { useEffect, useState } from "react";
import { useUiStore } from "../store/ui";
import { Task } from "../types/db";

export default function SearchCommand() {
  const setFocus = useUiStore((s) => s.setFocusedId);
  const [open, setOpen] = useState(false);
  const { tasks } = useFilteredTasks({});
  const [items, setItems] = useState<typeof tasks>([]);

  /* open cmd+k */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* simple fuse on tasks list */
  const onQuery = (q: string) => {
    if (!tasks) return;
    if (!q.trim()) return setItems(tasks);
    const fuse = new Fuse(tasks, { keys: ["title"], threshold: 0.3 });
    setItems(fuse.search(q).map((r) => r.item));
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput
          placeholder="Rechercher une tâche..."
          onValueChange={onQuery}
        />
        <CommandList>
          {items?.map((t: Task) => (
            <CommandItem
              key={t.id}
              onSelect={() => {
                setFocus(t.id);
                setOpen(false);
              }}
            >
              {t.title}
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
