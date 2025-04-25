"use client";
import { Badge } from "@/src/components/ui/badge";
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
import { Check } from "lucide-react";
import { useState } from "react";
import { useStatuses } from "../hooks/useMutateStatus";
import { Status } from "../types/db";

const pastel = (hex: string) => `${hex}22`;

export default function StatusSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const { data: statuses } = useStatuses();
  const [open, setOpen] = useState(false);

  const current = statuses?.find((s: Status) => s.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onPointerDown={(e) => e.stopPropagation()}>
        <Badge
          className="rounded-sm cursor-pointer"
          style={{
            background: pastel(current?.color ?? "#ccc"),
            color: current?.color,
          }}
        >
          {current?.name ?? "Statut"}
        </Badge>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-48" align="start">
        <Command>
          <CommandInput placeholder="Rechercher…" />
          <CommandList>
            {statuses?.map((s: Status) => (
              <CommandItem
                key={s.id}
                onSelect={() => onChange(s.id)}
                className="flex gap-2"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: s.color }}
                />
                {s.name}
                {value === s.id && (
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
