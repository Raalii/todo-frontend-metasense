"use client";
import { api } from "@/src/lib/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import useSWR from "swr";
import { Category } from "../types/db";
import { ServerError } from "../types/next-auth";

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    "/api/categories",
    () => api.get("/api/categories").then((r) => r.data)
  );

  return { data, error, isLoading, mutate };
}

export function useMutateCategories() {
  const { mutate } = useSWR("/api/categories");

  const handler = async (fn: () => Promise<void>, msgOK: string) => {
    try {
      await fn();
      mutate();
      toast.success(msgOK);
    } catch (e) {
      const err = e as AxiosError<ServerError>;
      const msg =
        err?.response?.status === 409
          ? "Impossible : catégorie utilisée par des tâches"
          : "Action impossible";
      toast.error(msg);
    }
  };

  return {
    create: (name: string, color: string) =>
      handler(
        () => api.post("/api/categories", { name, color }),
        "Catégorie créée"
      ),
    update: (id: string, name: string, color: string) =>
      handler(
        () => api.put(`/api/categories/${id}`, { name, color }),
        "Catégorie mise à jour"
      ),
    remove: (id: string) =>
      handler(() => api.delete(`/api/categories/${id}`), "Catégorie supprimée"),
  };
}
