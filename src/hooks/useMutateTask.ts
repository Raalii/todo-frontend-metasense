"use client";
import { api } from "@/src/lib/api";
import QueryString from "qs";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

interface Filters {
  projectId?: string | null;
  statusId?: string;
  categoryIds?: string[];
}

export function useTasks(filters: Filters) {
  const query = QueryString.stringify(filters, {
    skipNulls: true,
    arrayFormat: "repeat",
  });
  return useSWR(["tasks", query], () =>
    api.get("/api/tasks", { params: filters }).then((r) => r.data)
  );
}

export async function deleteTask(id: string) {
  try {
    await api.delete(`/api/tasks/${id}`);
    mutate((key) => Array.isArray(key) && key[0] === "tasks");
    toast.success("Tâche supprimée");
  } catch {
    toast.error("Impossible de supprimer");
  }
}

export function useMutateTaskCategories() {
  return async (taskId: string, categoryIds: string[]) => {
    try {
      await api.put(`/api/tasks/${taskId}`, { categoryIds });
      mutate((key) => Array.isArray(key) && key[0] === "tasks"); // refresh cache
      toast.success("Catégories mises à jour");
    } catch {
      toast.error("Impossible de mettre à jour");
    }
  };
}

export async function setTaskProject(taskId: string, projectId: string | null) {
  try {
    await api.put(`/api/tasks/${taskId}`, { projectId });
    mutate((k) => Array.isArray(k) && k[0] === "tasks");
    toast.success("Projet mis à jour");
  } catch {
    toast.error("Impossible de mettre à jour");
  }
}

export async function setTaskStatus(taskId: string, statusId: string) {
  try {
    await api.put(`/api/tasks/${taskId}`, { statusId });
    mutate((k) => Array.isArray(k) && k[0] === "tasks");
    toast.success("Statut mis à jour");
  } catch {
    toast.error("Impossible de mettre à jour");
  }
}
