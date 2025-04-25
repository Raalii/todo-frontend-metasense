"use client";

import { useFilterStore } from "@/src/store/filters";
import Fuse from "fuse.js";
import { Task } from "../types/db";
import { useTasks } from "./useMutateTask";

export function useFilteredTasks(opts: { projectId?: string }) {
  const { data: all } = useTasks(opts);
  const { statusIds, categoryIds, projectId, query, sort } = useFilterStore();

  if (!all) return { tasks: null };

  /* --- statuts + catégories --- */
  let tasks = all.filter((t: Task) => {
    const statusOk = statusIds.length === 0 || statusIds.includes(t.statusId);
    const catOk =
      categoryIds.length === 0 ||
      t.categories.some((c) => categoryIds.includes(c.id));
    return statusOk && catOk;
  });

  /* --- projet (filtre unique) --- */
  if (projectId) tasks = tasks.filter((t: Task) => t.projectId === projectId);

  /* --- recherche Fuse.js --- */
  if (query.trim()) {
    const fuse = new Fuse(tasks, { keys: ["title"], threshold: 0.3 });
    tasks = fuse.search(query).map((r) => r.item);
  }

  /* --- tri --- */
  tasks.sort((a: Task, b: Task) => {
    if (sort === "title") return a.title.localeCompare(b.title);
    if (sort === "new") return +new Date(b.createdAt) - +new Date(a.createdAt);
    return +new Date(a.createdAt) - +new Date(b.createdAt);
  });

  return { tasks };
}
