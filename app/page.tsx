"use client";

import { useState } from "react";
import useSWR from "swr";

type Task = {
  id: number;
  text: string;
  done: boolean;
  created_at: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
const fetcher = (url: string) =>
  fetch(`${API_BASE}${url}`).then(async (res) => {
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();
  });

export default function Home() {
  const {
    data: tasks,
    mutate,
    error,
    isLoading,
  } = useSWR<Task[]>("/api/tasks", fetcher);
  const [text, setText] = useState("");

  if (error)
    return <p className="p-4 text-red-600">Erreur : {error.message}</p>;
  if (isLoading) return <p className="p-4">Chargement…</p>;

  const addTask = async () => {
    if (!text.trim()) return;
    const newTask = await fetch(`${API_BASE}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }).then((r) => r.json());
    mutate([newTask, ...(tasks || [])], false);
    setText("");
  };

  const toggleDone = async (task: Task) => {
    const updated = await fetch(`${API_BASE}/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !task.done }),
    }).then((r) => r.json());
    mutate(
      tasks!.map((t) => (t.id === updated.id ? updated : t)),
      false
    );
  };

  const deleteTask = async (id: number) => {
    await fetch(`${API_BASE}/api/tasks/${id}`, { method: "DELETE" });
    mutate(
      tasks!.filter((t) => t.id !== id),
      false
    );
  };

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">To‑Do List</h1>

      {/* Ajout de tâche */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          className="flex-grow p-2 border rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nouvelle tâche"
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Ajouter
        </button>
      </div>

      {/* Liste des tâches */}
      <ul className="space-y-2">
        {tasks?.map((t) => (
          <li
            key={t.id}
            className="flex justify-between items-center p-3 border rounded"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleDone(t)}
                className="text-xl"
                aria-label={t.done ? "Marquer comme non terminé" : "Terminer"}
              >
                {t.done ? "✓" : "✗"}
              </button>
              <span className={t.done ? "line-through text-gray-500" : ""}>
                {t.text}
              </span>
            </div>
            <button
              onClick={() => deleteTask(t.id)}
              className="text-red-600 hover:text-red-800"
              aria-label="Supprimer"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
