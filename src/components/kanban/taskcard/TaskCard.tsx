"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Input } from "@/src/components/ui/input";
import { useStatuses } from "@/src/hooks/useMutateStatus";

import {
  deleteTask,
  setTaskProject,
  useMutateTaskCategories,
} from "@/src/hooks/useMutateTask";
import { api } from "@/src/lib/api";
import { useUiStore } from "@/src/store/ui";
import { Status, Task } from "@/src/types/db";
import { Check, MoreVertical, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import CategorySelector from "../../pickers/CategorySelector";
import ProjectSelector from "../../pickers/ProjectSelector";
import StatusBadge from "../../StatusBadge";

/* helper pastel */
const pastel = (hex: string) => `${hex}22`;

type Props = {
  task: Task;
  onEdit?: (editing: boolean) => void;
};

export default function TaskCard({ task, onEdit }: Props) {
  const { data: statuses } = useStatuses();
  const status = statuses?.find((s: Status) => s.id === task.statusId);

  /* focus highlight ------------------------------------------------- */
  const ref = useRef<HTMLDivElement>(null);
  const { focusedId, setFocusedId } = useUiStore();
  useEffect(() => {
    if (focusedId === task.id && ref.current) {
      ref.current.scrollIntoView({ block: "center", behavior: "smooth" });
      ref.current.classList.add("ring-2", "ring-primary");
      const t = setTimeout(() => {
        ref.current?.classList.remove("ring-2", "ring-primary");
        setFocusedId(undefined);
      }, 1200);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedId]);

  /* édition titre --------------------------------------------------- */
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const startEdit = () => {
    setEdit(true);
    onEdit?.(true);
  };
  const cancelEdit = () => {
    setTitle(task.title);
    setEdit(false);
    onEdit?.(false);
  };
  const save = async () => {
    if (!title.trim() || title === task.title) return cancelEdit();
    setSaving(true);
    try {
      await api.put(`/api/tasks/${task.id}`, { title });
      mutate((k) => Array.isArray(k) && k[0] === "tasks");
      toast.success("Titre mis à jour");
    } catch {
      toast.error("Impossible de mettre à jour");
      setTitle(task.title);
    } finally {
      setSaving(false);
      setEdit(false);
      onEdit?.(false);
    }
  };

  /* catégories ------------------------------------------------------ */
  const mutateCats = useMutateTaskCategories();
  const catIds = task.categories.map((c) => c.id);

  /* lecture (card) -------------------------------------------------- */
  return (
    <div
      ref={ref}
      onDoubleClick={startEdit}
      className="relative rounded-md border px-3 py-2 bg-background shadow-sm text-sm space-y-2 group"
    >
      {/* menu 3 points (apparaît au survol) */}
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className="absolute top-1 right-1 p-1 opacity-0 group-hover:opacity-100
                 rounded hover:bg-muted transition"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <MoreVertical size={14} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onPointerDown={(e) => e.stopPropagation()}
            className="gap-2 text-destructive focus:text-destructive"
            onSelect={async (e) => {
              e.preventDefault(); /* 1️⃣ garde le menu ouvert */
              await deleteTask(task.id); /* 2️⃣ requête + toast */
              setMenuOpen(false); /* 3️⃣ ferme proprement */
            }}
          >
            <Trash2 size={14} /> Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {edit ? (
        /* -------- mode édition titre -------- */
        <div className="flex items-center gap-1">
          <Input
            value={title}
            className="h-7 flex-1"
            disabled={saving}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") cancelEdit();
            }}
          />
          <button onClick={save} disabled={saving} className="p-1">
            <Check size={14} />
          </button>
          <button onClick={cancelEdit} className="p-1">
            <X size={14} />
          </button>
        </div>
      ) : (
        /* -------- lecture -------- */
        <>
          <div>{task.title}</div>

          {/* badges + selector */}
          <div className="flex flex-wrap gap-1">
            {task.categories.map((c) => (
              <span
                key={c.id}
                className="px-1.5 py-0.5 rounded-sm text-xs font-medium"
                style={{ background: pastel(c.color), color: c.color }}
              >
                {c.name}
              </span>
            ))}
            <CategorySelector
              value={catIds}
              onChange={(ids) => mutateCats(task.id, ids)}
            />
          </div>
          <div className="flex items-center gap-1">
            {task.project && (
              <span className="px-1.5 py-0.5 rounded-sm text-xs bg-muted">
                {task.project.name}
              </span>
            )}
            <ProjectSelector
              value={task.projectId}
              onChange={(id) => setTaskProject(task.id, id)}
            />
          </div>
          {status && <StatusBadge status={status} />}
        </>
      )}
    </div>
  );
}
