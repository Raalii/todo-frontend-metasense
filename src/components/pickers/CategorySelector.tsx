"use client";

import { Button } from "@/src/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { useCategories } from "../../hooks/useMutateCategories";

/* helper pour un fond pastel ↘︎ */
export const pastel = (hex: string) => `${hex}22`;

export default function CategorySelector({
  value,
  onChange,
}: {
  value: string[] /* id sélectionnés   */;
  onChange: (ids: string[]) => void /* nouveau tableau   */;
}) {
  const { data: categories } = useCategories();
  const [open, setOpen] = useState(false);
  const toggle = (id: string) =>
    value.includes(id) ? value.filter((i) => i !== id) : [...value, id];

  /* -------- trigger : icône seule OU badge fantôme --------------- */
  const Trigger = () =>
    value.length ? (
      <div className="h-6 w-6">
        <Plus size={14} />
      </div>
    ) : (
      <div
        className="inline-flex items-center gap-1 px-1.5 py-0.5
+              rounded-sm text-xs border text-muted-foreground
              hover:bg-muted/60"
      >
        <Plus size={12} />
        Catégorie
      </div>
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onPointerDown={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 flex w-[50%] justify-start"
        >
          <Trigger />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        className="p-0 w-56"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Command>
          <CommandInput placeholder="Rechercher une catégorie…" />
          <CommandList>
            {categories?.map((c) => (
              <CommandItem
                key={c.id}
                onSelect={() => {
                  onChange(toggle(c.id));
                  /* ne ferme pas, multi-select */
                }}
                className="flex items-center gap-2"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: c.color }}
                />
                {c.name}
                {value.includes(c.id) && (
                  <Check className="ml-auto h-4 w-4 opacity-60" />
                )}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
