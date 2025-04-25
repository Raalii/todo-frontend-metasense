"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import ColorPicker from "./pickers/ColorPicker";

type Props = {
  trigger: React.ReactNode;
  title: string;
  initial?: { name: string; color: string };
  onSubmit: (name: string, color: string) => Promise<void>;
  onDelete?: () => Promise<void>; // facultatif (présent en mode édition)
};

export default function EditDialog({
  trigger,
  title,
  initial = { name: "", color: "#8e8e8e" },
  onSubmit,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initial.name);
  const [color, setColor] = useState(initial.color);
  const [loading, setLoading] = useState(false);

  /* ------------------------------------------------------------------ */
  /*  helpers                                                            */
  /* ------------------------------------------------------------------ */
  const reset = () => {
    setName(initial.name);
    setColor(initial.color);
    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(name.trim(), color);
      setOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur inconnue");
      reset();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setLoading(true);
    try {
      await onDelete();
      setOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur inconnue");
      reset();
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------ */
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Nom"
            value={name}
            disabled={loading}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <span>Couleur :</span>
            <ColorPicker value={color} onChange={setColor} />
          </div>
        </div>

        <DialogFooter>
          {onDelete && (
            <Button
              variant="destructive"
              disabled={loading}
              onClick={handleDelete}
            >
              Supprimer
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="ghost" disabled={loading}>
              Annuler
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={loading || !name.trim()}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
