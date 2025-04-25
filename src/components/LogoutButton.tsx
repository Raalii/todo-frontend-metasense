// src/components/LogoutButton.tsx
"use client";

import { Button } from "@/src/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      title="Se déconnecter"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <LogOut className="h-5 w-5" />
    </Button>
  );
}
