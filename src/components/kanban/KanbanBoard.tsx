"use client";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { api } from "@/src/lib/api";
import { useUiStore } from "@/src/store/ui";
import { Status, Task } from "@/src/types/db";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { useFilteredTasks } from "../../hooks/useFilteredTasks";
import { useStatuses } from "../../hooks/useMutateStatus";
import StatusColumn from "../StatusColumn";
import BoardSkeleton from "./BoardSkeleton";
import TaskCard from "./taskcard/TaskCard";

export default function KanbanBoard() {
  /* -------- data -------- */
  const { currentProjectId } = useUiStore();
  const { data: statuses } = useStatuses();
  const { tasks } = useFilteredTasks({
    projectId: currentProjectId ?? undefined,
  });

  /* -------- sensors -------- */
  const sensors = useSensors(useSensor(PointerSensor));

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  /* -------- handlers -------- */
  async function handleDragEnd(evt: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = evt;
    if (!over) return;

    const taskId = active.id as string;
    const oldStatus = active.data.current?.statusId as string;
    const newStatus = over.data.current?.statusId as string; // colonne cible

    if (!newStatus || newStatus === oldStatus) return;

    /* optimistic */
    mutate(
      (k) => Array.isArray(k) && k[0] === "tasks",
      (curr?: Task[]) =>
        curr?.map((t) => (t.id === taskId ? { ...t, statusId: newStatus } : t)),
      false
    );

    try {
      await api.put(`/api/tasks/${taskId}`, { statusId: newStatus });
    } catch {
      toast.error("Échec déplacement");
      mutate(() => true); // rollback
    }
  }

  if (!statuses || !tasks) return <BoardSkeleton />;

  /* -------- UI -------- */
  return (
    <DndContext
      sensors={sensors}
      modifiers={[]}
      onDragStart={(e) => {
        const task = tasks.find((t: Task) => t.id === e.active.id);
        setActiveTask(task ?? null);
      }}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statuses.map((status: Status) => (
          <StatusColumn
            key={status.id}
            status={status}
            tasks={tasks.filter((t: Task) => t.statusId === status.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
