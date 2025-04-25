"use client";

import { api } from "@/src/lib/api";
import { useUiStore } from "@/src/store/ui";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { toast } from "sonner";

import { useStatuses } from "@/src/hooks/useMutateStatus";
import { Status } from "@/src/types/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { mutate } from "swr";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, "Titre requis"),
  statusId: z.string().uuid("Statut obligatoire"),
});
type FormData = z.infer<typeof schema>;

export function AddTaskForm() {
  /* --------- données distantes --------- */
  const { data: statuses } = useStatuses();
  const { currentProjectId } = useUiStore();

  /* --------- RHF + Zod --------- */
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  /* --------- submit --------- */
  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/api/tasks", {
        ...data,
        projectId: currentProjectId,
      });
      mutate((key) => Array.isArray(key) && key[0] === "tasks"); // revalidation SWR
      toast.success("Tâche créée !");
      reset();
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Impossible d'enregistrer la tâche";
      toast.error(msg);
    }
  };

  if (!statuses) return null; // en cours de chargement

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Nouvelle tâche</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une tâche</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          {/* ---- Titre ---- */}
          <div className="space-y-1">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              placeholder="Ma super tâche"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* ---- Statut ---- */}
          <div className="space-y-1">
            <Label>Statut</Label>
            <Controller
              control={control}
              name="statusId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir…" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s: Status) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.statusId && (
              <p className="text-xs text-red-500">{errors.statusId.message}</p>
            )}
          </div>

          {/* ---- Bouton ---- */}
          <Button type="submit" disabled={!isValid || isSubmitting}>
            {isSubmitting ? "…" : "Créer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
