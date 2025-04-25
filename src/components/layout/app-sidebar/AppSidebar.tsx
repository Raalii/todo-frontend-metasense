"use client";

import ThemeToggle from "@/src/components/ThemeToggle";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail, // rail = mince poignée pour replier / déplier
} from "@/src/components/ui/sidebar"; // ← généré par shadcn add sidebar
import { Plus } from "lucide-react";

import { useMutateCategories } from "@/src/hooks/useMutateCategories";
import { useMutateProject } from "@/src/hooks/useMutateProject";
import { useMutateStatus } from "@/src/hooks/useMutateStatus";
import { api } from "@/src/lib/api";
import { Category, Project, Status } from "@/src/types/db";
import useSWR from "swr";
import EditDialog from "../../EditDialog";

/* ------------------------------------------------------------------ */
/*  Données dynamiques                                                */
/* ------------------------------------------------------------------ */
const useProjects = () =>
  useSWR<Project[]>("/api/projects", () =>
    api.get("/api/projects").then((r) => r.data)
  );
const useStatuses = () =>
  useSWR<Status[]>("/api/statuses", () =>
    api.get("/api/statuses").then((r) => r.data)
  );
const useCategories = () =>
  useSWR<Category[]>("/api/categories", () =>
    api.get("/api/categories").then((r) => r.data)
  );

/* ------------------------------------------------------------------ */
/*  Barre latérale                                                    */
/* ------------------------------------------------------------------ */
export function AppSidebar() {
  const { data: projects } = useProjects();
  const { data: statuses } = useStatuses();
  const { data: categories } = useCategories();
  const mutateStatus = useMutateStatus();
  const mutateCategory = useMutateCategories();
  const mutateProject = useMutateProject();

  return (
    <Sidebar>
      {" "}
      {/* rail replie/déplie */}
      {/* ── en-tête (logo ou titre) ─────────────────────────────── */}
      <SidebarHeader>
        <div className="font-bold text-lg tracking-tight px-3">MetaTodo</div>
      </SidebarHeader>
      {/* ── contenu scrollable ───────────────────────────────────── */}
      <SidebarContent>
        {/* ---- Projets ------------------------------------------ */}
        <SidebarGroup>
          <SidebarGroupLabel>Projets</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects?.map((p) => (
                <SidebarMenuItem key={p.id}>
                  <EditDialog
                    trigger={
                      <SidebarMenuButton asChild>
                        <span>{p.name}</span>
                      </SidebarMenuButton>
                    }
                    title="Modifier le projet"
                    initial={{
                      name: p.name,
                      color: "",
                    }} /* pas de couleur ici */
                    onSubmit={(name) => mutateProject.update(p.id, name)}
                    onDelete={() => mutateProject.remove(p.id)}
                  />
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <EditDialog
                  trigger={
                    <SidebarMenuButton asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Plus size={14} className="mr-1" />
                        Nouveau
                      </Button>
                    </SidebarMenuButton>
                  }
                  title="Nouveau projet"
                  onSubmit={(name) => mutateProject.create(name)}
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ---- Statuts ----------------------------------------- */}
        <SidebarGroup>
          <SidebarGroupLabel>Statuts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {statuses?.map((s) => (
                <SidebarMenuItem key={s.id}>
                  <EditDialog
                    trigger={
                      <SidebarMenuButton asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ background: s.color }}
                          />
                          <span>{s.name}</span>
                        </div>
                      </SidebarMenuButton>
                    }
                    title="Modifier le statut"
                    initial={{ name: s.name, color: s.color }}
                    onSubmit={(name, color) =>
                      mutateStatus.update(s.id, name, color)
                    }
                    onDelete={() => mutateStatus.remove(s.id)}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <SidebarMenuItem>
              <EditDialog
                trigger={
                  <SidebarMenuButton asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Plus size={14} className="mr-1" />
                      Nouveau
                    </Button>
                  </SidebarMenuButton>
                }
                title="Nouveau statut"
                onSubmit={(name, color) => mutateStatus.create(name, color)}
              />
            </SidebarMenuItem>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ---- Catégories -------------------------------------- */}
        <SidebarGroup>
          <SidebarGroupLabel>Catégories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories?.map((c) => (
                <SidebarMenuItem key={c.id}>
                  <EditDialog
                    trigger={
                      <SidebarMenuButton asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ background: c.color }}
                          />
                          <span>{c.name}</span>
                        </div>
                      </SidebarMenuButton>
                    }
                    title="Modifier la catégorie"
                    initial={{ name: c.name, color: c.color }}
                    onSubmit={(name, color) =>
                      mutateCategory.update(c.id, name, color)
                    }
                    onDelete={() => mutateCategory.remove(c.id)}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarMenuItem>
            <EditDialog
              trigger={
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Plus size={14} className="mr-1" />
                    Nouvelle
                  </Button>
                </SidebarMenuButton>
              }
              title="Nouvelle catégorie"
              onSubmit={(name, color) => mutateCategory.create(name, color)}
            />
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarContent>
      {/* ── pied : thème + profil + logout ─────────────────────── */}
      <SidebarFooter>
        <div className="flex items-center gap-2 pl-3 pr-2 w-full">
          <Avatar className="h-6 w-6">
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <ThemeToggle />
          <Button
            size="icon"
            variant="ghost"
            className="ml-auto"
            title="Déconnexion"
          >
            🚪
          </Button>
        </div>
      </SidebarFooter>
      {/* ── rail (poignée) ─────────────────────────────────────── */}
      <SidebarRail />
    </Sidebar>
  );
}
