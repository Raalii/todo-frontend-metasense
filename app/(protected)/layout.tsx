"use client"; // 1️⃣
import { AppSidebar } from "@/src/components/layout/app-sidebar/AppSidebar";
// app/(protected)/layout.tsx
import { Header } from "@/src/components/layout/Header";

import Toolbar from "@/src/components/Toolbar";
// import SidebarToggle from "@/src/components/SidebarToggle";
import { SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar"; // ← 1️⃣
import type { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    /* 2️⃣ on englobe tout ce qui utilise useSidebar */
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar /> {/* barre rétractable shadcn */}
        <SidebarTrigger />
        {/* ── contenu principal ─────────────────────────────────────── */}
        <div className="flex-1 flex flex-col w-full px-5">
          <Header /> {/* le rail / menus peuvent l’appeler */}
          <Toolbar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
