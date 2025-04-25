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
} from "@/src/components/ui/popover"; // déjà existant
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { useProjects } from "../../hooks/useMutateProject";

export default function ProjectSelector({
  value, // id actuel ou null
  onChange,
}: {
  value: string | null;
  onChange: (id: string | null) => void;
}) {
  const { data: projects } = useProjects();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onPointerDown={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="sm" className="gap-1 h-6 text-[12px]">
          {value ? (
            "Changer projet"
          ) : (
            <>
              <Plus size={12} /> Projet
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="p-0 w-56"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Command>
          <CommandInput placeholder="Rechercher un projet…" />
          <CommandList>
            <CommandItem
              key="none"
              onSelect={() => onChange(null)}
              className="flex gap-2"
            >
              Aucun
              {!value && <Check className="ml-auto h-4 w-4 opacity-60" />}
            </CommandItem>
            {projects?.map((p) => (
              <CommandItem
                key={p.id}
                onSelect={() => onChange(p.id)}
                className="flex gap-2"
              >
                {p.name}
                {value === p.id && (
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
