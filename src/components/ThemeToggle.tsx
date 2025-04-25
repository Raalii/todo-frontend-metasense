"use client";
import { Button } from "@/src/components/ui/button";
import { useThemeStore } from "@/src/store/theme";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggle } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Changer de thème"
      suppressHydrationWarning
    >
      {mounted ? (
        theme === "dark" ? (
          <Sun size={16} />
        ) : (
          <Moon size={16} />
        )
      ) : null}
    </Button>
  );
}
