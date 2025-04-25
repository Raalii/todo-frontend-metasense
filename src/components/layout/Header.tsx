"use client";

import { Button } from "@/src/components/ui/button";
import { useUiStore } from "@/src/store/ui";
import { AddTaskForm } from "../kanban/AddTaskForm";

export function Header() {
  const { view, setView } = useUiStore();
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* <Burger /> */}
      <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setView(view === "kanban" ? "table" : "kanban")}
        >
          {view === "kanban" ? "Liste" : "Kanban"}
        </Button>
        <AddTaskForm />
      </div>
    </header>
  );
}
