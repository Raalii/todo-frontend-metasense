import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SortMode = "title" | "new" | "old";

export const useFilterStore = create(
  persist<{
    statusIds: string[];
    categoryIds: string[];
    projectId: string | null;
    query: string;
    sort: SortMode;
    /* setters */
    setStatuses: (ids: string[]) => void;
    setCategories: (ids: string[]) => void;
    setProject: (id: string | null) => void;
    setQuery: (q: string) => void;
    setSort: (s: SortMode) => void;
    clear: () => void;
  }>(
    (set) => ({
      statusIds: [],
      categoryIds: [],
      projectId: null,
      query: "",
      sort: "new",
      setStatuses: (ids) => set({ statusIds: ids }),
      setCategories: (ids) => set({ categoryIds: ids }),
      setProject: (id) => set({ projectId: id }),
      setQuery: (q) => set({ query: q }),
      setSort: (s) => set({ sort: s }),
      clear: () =>
        set({
          statusIds: [],
          categoryIds: [],
          projectId: null,
          query: "",
        }),
    }),
    { name: "filters" }
  )
);
