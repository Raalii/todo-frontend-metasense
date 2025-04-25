"use client";
import { api } from "@/src/lib/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import useSWR from "swr";
import { Project } from "../types/db";
import { ServerError } from "../types/next-auth";

/** Liste tous les projets de l’utilisateur. */
export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR<Project[]>(
    "/api/projects",
    () => api.get("/api/projects").then((r) => r.data)
  );

  return { data, error, isLoading, mutate };
}

export function useMutateProject() {
  const { mutate } = useSWR("/api/projects");

  const run = async (fn: () => Promise<void>, ok: string) => {
    try {
      await fn();
      mutate();
      toast.success(ok);
    } catch (e) {
      const err = e as AxiosError<ServerError>;
      const msg =
        err?.response?.status === 409
          ? "Impossible : projet contient encore des tâches"
          : "Action impossible";
      toast.error(msg);
    }
  };

  return {
    create: (name: string) =>
      run(() => api.post("/api/projects", { name }), "Projet créé"),
    update: (id: string, name: string) =>
      run(() => api.put(`/api/projects/${id}`, { name }), "Projet renommé"),
    remove: (id: string) =>
      run(() => api.delete(`/api/projects/${id}`), "Projet supprimé"),
  };
}
