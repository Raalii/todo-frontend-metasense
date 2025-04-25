"use client";

import { Badge } from "@/src/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { SortMode, useFilterStore } from "@/src/store/filters";
import { Check, ChevronDown } from "lucide-react";
import { useCategories } from "../hooks/useMutateCategories";
import { useProjects } from "../hooks/useMutateProject";
import { useStatuses } from "../hooks/useMutateStatus";
import { Status } from "../types/db";
import SearchCommand from "./SearchCommand";

export default function Toolbar() {
  const {
    statusIds,
    categoryIds,
    projectId,
    setStatuses,
    setCategories,
    setProject,
    sort,
    setSort,
    clear,
  } = useFilterStore();

  const { data: statuses } = useStatuses();
  const { data: categories } = useCategories();
  const { data: projects } = useProjects();
  const toggle = (arr: string[], id: string) =>
    arr.includes(id) ? arr.filter((i) => i !== id) : [...arr, id];

  return (
    <div className="sticky top-12 z-10 mt-6 pb-6 flex items-center gap-3 h-10 px-3 border-b bg-background/80 backdrop-blur">
      {/* palette ⌘K */}
      <SearchCommand />

      {/* statuts */}
      {statuses?.map((s: Status) => (
        <Badge
          key={s.id}
          onClick={() => setStatuses(toggle(statusIds, s.id))}
          className={`cursor-pointer select-none ${
            statusIds.includes(s.id) ? "" : "opacity-40"
          }`}
          style={{ background: `${s.color}22`, color: s.color }}
        >
          {s.name}
        </Badge>
      ))}

      {/* catégories */}
      {categories?.map((c) => (
        <Badge
          key={c.id}
          variant="outline"
          onClick={() => setCategories(toggle(categoryIds, c.id))}
          className={`cursor-pointer ${
            categoryIds.includes(c.id) ? "border-primary" : "opacity-40"
          }`}
        >
          {c.name}
        </Badge>
      ))}

      {/* projet dropdown */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1 h-7">
            {projectId
              ? projects?.find((p) => p.id === projectId)?.name ?? "Projet"
              : "Projet"}
            <ChevronDown size={12} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-48" align="start">
          <Command>
            <CommandInput placeholder="Rechercher un projet…" />
            <CommandList>
              <CommandItem
                key="all"
                onSelect={() => setProject(null)}
                className="cursor-pointer"
              >
                Tous
                {!projectId && <Check className="ml-auto h-4 w-4 opacity-60" />}
              </CommandItem>
              {projects?.map((p) => (
                <CommandItem
                  key={p.id}
                  onSelect={() => setProject(p.id)}
                  className="cursor-pointer"
                >
                  {p.name}
                  {projectId === p.id && (
                    <Check className="ml-auto h-4 w-4 opacity-60" />
                  )}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* tri */}
      <Select value={sort} onValueChange={(v) => setSort(v as SortMode)}>
        <SelectTrigger className="w-28 h-7 ml-auto">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">Plus récent</SelectItem>
          <SelectItem value="old">Plus ancien</SelectItem>
          <SelectItem value="title">Titre A→Z</SelectItem>
        </SelectContent>
      </Select>

      {/* reset */}
      <Button variant="ghost" size="sm" onClick={clear}>
        Réinitialiser
      </Button>
    </div>
  );
}
