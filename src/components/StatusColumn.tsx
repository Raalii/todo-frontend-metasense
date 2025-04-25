"use client";
import { Status, Task } from "@/src/types/db";
import { useDroppable } from "@dnd-kit/core";
import DraggableTaskCard from "./kanban/taskcard/DraggableTaskCard";

type Props = { status: Status; tasks: Task[] };

export default function StatusColumn({ status, tasks }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: status.id,
    data: { type: "column", statusId: status.id },
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-72 shrink-0 flex flex-col gap-2 rounded-md p-2
        ${isOver ? "bg-muted/50" : ""}`}
    >
      <h3 className="font-semibold text-sm mb-1">{status.name}</h3>
      {tasks.map((t) => (
        <DraggableTaskCard key={t.id} task={t} />
      ))}
    </div>
  );
}
