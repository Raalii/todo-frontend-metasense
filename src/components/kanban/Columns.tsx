import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { api } from "@/src/lib/api";
import { Task } from "@/src/types/db";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

/* pastel helper */
const pastel = (hex: string) => `${hex}22`;

export const makeColumns = (lookups: {
  statusName: (id: string) => string;
  projectName: (id: string | null) => string;
}): ColumnDef<Task>[] => [
  {
    header: "Titre",
    accessorKey: "title",
    cell: ({ row, getValue }) => (
      <InlineEdit task={row.original} value={getValue() as string} />
    ),
  },
  {
    header: "Statut",
    accessorFn: (t) => lookups.statusName(t.statusId),
  },
  {
    header: "Projet",
    accessorFn: (t) => lookups.projectName(t.projectId),
  },
  {
    header: "Catégories",
    accessorFn: (t) => t.categories.map((c) => c.name).join(", "),
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.categories.map((c) => (
          <Badge
            key={c.id}
            className="rounded-sm"
            style={{ background: pastel(c.color), color: c.color }}
          >
            {c.name}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    header: "Créée le",
    accessorKey: "createdAt",
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
  },
];

/* --- titre inline ------------------------------------------------- */
function InlineEdit({ task, value }: { task: Task; value: string }) {
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(value);

  const save = async () => {
    if (!title.trim() || title === value) return setEdit(false);
    try {
      await api.put(`/api/tasks/${task.id}`, { title });
      mutate((k) => Array.isArray(k) && k[0] === "tasks");
      toast.success("Titre mis à jour");
    } catch {
      toast.error("Impossible");
    } finally {
      setEdit(false);
    }
  };

  return edit ? (
    <Input
      value={title}
      autoFocus
      className="h-7"
      onChange={(e) => setTitle(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === "Enter") save();
        if (e.key === "Escape") setEdit(false);
      }}
    />
  ) : (
    <span onDoubleClick={() => setEdit(true)} className="cursor-pointer">
      {value}
    </span>
  );
}
