"use client";

import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { useState } from "react";
import { useCategories } from "../../hooks/useMutateCategories";

export default function CategoryPicker({
  value,
  onChange,
}: {
  value: string[]; // ids sélectionnées
  onChange: (ids: string[]) => void;
}) {
  const { data: categories } = useCategories();
  const [open, setOpen] = useState(false);

  /* toggle helper --------------------------------------------------   - */
  const toggle = (id: string) =>
    onChange(
      value.includes(id) ? value.filter((i) => i !== id) : [...value, id]
    );

  /* stop drag-start on interactive element -------------------------- */
  const stop = (e: React.PointerEvent | React.MouseEvent) =>
    e.stopPropagation();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onPointerDown={stop} /* 🔑 empêche dnd-kit de capter l’event */
          onClick={stop}
        >
          + Catégorie
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        className="w-56 p-2 space-y-1"
        onPointerDown={stop} /* idem à l’intérieur du pop-over */
      >
        {categories?.map((c) => (
          <label
            key={c.id}
            className="flex items-center gap-2 text-sm rounded px-2 py-1
                       hover:bg-muted cursor-pointer select-none"
          >
            <Checkbox
              checked={value.includes(c.id)}
              onCheckedChange={() => toggle(c.id)}
            />
            <span>{c.name}</span>
          </label>
        ))}
      </PopoverContent>
    </Popover>
  );
}
