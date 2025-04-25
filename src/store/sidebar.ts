// src/store/sidebar.ts
import { create } from "zustand";

export const useSidebarStore = create<{
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
}>((set) => ({
  open: false,
  setOpen: (v) => set({ open: v }),
  toggle: () => set((s) => ({ open: !s.open })),
}));
