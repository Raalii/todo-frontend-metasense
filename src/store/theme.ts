// src/store/theme.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  set: (t: Theme) => void;
}

/* clé unique dans localStorage */
const STORAGE_KEY = "theme";

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light", // valeur par défaut (écrasée par rehydratation)

      toggle: () => {
        const next: Theme = get().theme === "light" ? "dark" : "light";
        get().set(next);
      },

      set: (t) => {
        /* applique la classe sur <html> */
        document.documentElement.classList.toggle("dark", t === "dark");
        set({ theme: t });
      },
    }),
    {
      name: STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        /* quand zustand relit localStorage au démarrage */
        if (state) {
          document.documentElement.classList.toggle(
            "dark",
            state.theme === "dark"
          );
        }
      },
    }
  )
);
