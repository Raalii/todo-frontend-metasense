"use client";
import { api } from "@/src/lib/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import useSWR from "swr";
import { ServerError } from "../types/next-auth";

// * ---------- lecture --------------------------------------------- */
export function useStatuses() {
  return useSWR("/api/statuses", () =>
    api.get("/api/statuses").then((r) => r.data)
  );
}

// * ---------- helpers internes ------------------------------------ */
export function useMutateStatus() {
  const { mutate } = useSWR("/api/statuses");

  const handler = async (fn: () => Promise<void>, msgOK: string) => {
    try {
      await fn();
      mutate();
      toast.success(msgOK);
    } catch (e) {
      const err = e as AxiosError<ServerError>;
      /* erreur FK => message clair sinon générique */
      const msg =
        err?.response?.status === 409
          ? "Impossible : statut utilisé par des tâches"
          : "Action impossible";
      toast.error(msg);
    }
  };

  return {
    create: (name: string, color: string) =>
      handler(() => api.post("/api/statuses", { name, color }), "Statut créé"),
    update: (id: string, name: string, color: string) =>
      handler(
        () => api.put(`/api/statuses/${id}`, { name, color }),
        "Statut mis à jour"
      ),
    remove: (id: string) =>
      handler(() => api.delete(`/api/statuses/${id}`), "Statut supprimé"),
  };
}
