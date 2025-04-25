import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">
        Bienvenue sur <span className="text-primary">MetaTask</span>
      </h1>
      <p className="text-muted-foreground max-w-md text-center">
        Gérez vos tâches, projets et catégories dans une interface façon Notion.
      </p>
      <Button asChild>
        <Link href="/login">Commencer</Link>
      </Button>
    </main>
  );
}
