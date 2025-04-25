"use client";
import KanbanBoard from "@/src/components/kanban/KanbanBoard";
import DataTableLite from "@/src/components/table/DataTableLite";
import { useUiStore } from "@/src/store/ui";

export default function DashboardPage() {
  const { view } = useUiStore();
  return view === "kanban" ? <KanbanBoard /> : <DataTableLite />;
}
