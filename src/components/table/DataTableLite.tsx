"use client";

import CategorySelector from "@/src/components/pickers/CategorySelector";
import ProjectSelector from "@/src/components/pickers/ProjectSelector";
import StatusSelector from "@/src/components/StatusSelector";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { useFilteredTasks } from "@/src/hooks/useFilteredTasks";
import {
  setTaskStatus,
  useMutateTaskCategories,
} from "@/src/hooks/useMutateTask";
import { api } from "@/src/lib/api";
import { Task } from "@/src/types/db";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

const pastel = (hex: string) => `${hex}22`;

function EditableTitle({ task, value }: { task: Task; value: string }) {
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(value);

  const save = async () => {
    if (!title.trim() || title === value) return setEdit(false);
    try {
      await api.put(`/api/tasks/${task.id}`, { title });
      mutate((k) => Array.isArray(k) && k[0] === "tasks");
      toast.success("Titre mis à jour");
    } catch {
      toast.error("Impossible de mettre à jour");
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

export default function DataTableLite() {
  const { tasks } = useFilteredTasks({});
  const mutateCats = useMutateTaskCategories();

  if (!tasks)
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <ScrollArea className="h-[calc(100vh-160px)] w-full p-3">
      <table className="min-w-full text-sm">
        <thead className="sticky top-0 bg-background z-10">
          <tr>
            <th className="px-2 py-1 text-left border-b w-[28%]">Titre</th>
            <th className="px-2 py-1 text-left border-b w-[14%]">Statut</th>
            <th className="px-2 py-1 text-left border-b w-[18%]">Projet</th>
            <th className="px-2 py-1 text-left border-b">Catégories</th>
            <th className="px-2 py-1 text-left border-b w-[12%]">Créée le</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t: Task) => (
            <tr key={t.id} className="odd:bg-muted/30">
              {/* Titre ------------------------------------------------ */}
              <td className="px-2 py-1">
                <EditableTitle task={t} value={t.title} />
              </td>

              {/* Statut ---------------------------------------------- */}
              <td className="px-2 py-1">
                <StatusSelector
                  value={t.statusId}
                  onChange={(id) => setTaskStatus(t.id, id)}
                />
              </td>

              {/* Projet ---------------------------------------------- */}
              <td className="px-2 py-1">
                {t.project?.name && (
                  <span className="h-2 w-2 rounded-full">{t.project.name}</span>
                )}
                <ProjectSelector
                  value={t.projectId}
                  onChange={(id) =>
                    api
                      .put(`/api/tasks/${t.id}`, { projectId: id })
                      .then(() =>
                        mutate((k) => Array.isArray(k) && k[0] === "tasks")
                      )
                  }
                />
              </td>

              {/* Catégories ------------------------------------------ */}
              <td className="px-2 py-1">
                <div className="flex flex-wrap gap-1">
                  {t.categories.map((c) => (
                    <Badge
                      key={c.id}
                      className="rounded-sm"
                      style={{ background: pastel(c.color), color: c.color }}
                    >
                      {c.name}
                    </Badge>
                  ))}
                  <CategorySelector
                    value={t.categories.map((c) => c.id)}
                    onChange={(ids) => mutateCats(t.id, ids)}
                  />
                </div>
              </td>

              {/* Date ------------------------------------------------ */}
              <td className="px-2 py-1">
                {new Date(t.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}
