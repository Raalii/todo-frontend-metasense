import { create } from "zustand";
import { persist } from "zustand/middleware";

type View = "kanban" | "table";

export const useUiStore = create(
  persist<{
    view: View;
    setView: (v: View) => void;
    currentProjectId: string | null;
    setProject: (id: string | null) => void;
    focusedId?: string;
    setFocusedId: (id?: string) => void;
  }>(
    (set) => ({
      view: "kanban",
      setView: (view) => set({ view }),
      currentProjectId: null,
      setProject: (id) => set({ currentProjectId: id }),
      setFocusedId: (id) => set({ focusedId: id }),
    }),
    { name: "ui" } /* ← localStorage */
  )
);
