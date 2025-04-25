"use client";
import { Task } from "@/src/types/db";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import TaskCard from "./TaskCard";

export default function DraggableTaskCard({ task }: { task: Task }) {
  const [editing, setEditing] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { statusId: task.statusId, type: "task" },
      disabled: editing,
    });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      <TaskCard task={task} onEdit={setEditing} />
    </div>
  );
}
