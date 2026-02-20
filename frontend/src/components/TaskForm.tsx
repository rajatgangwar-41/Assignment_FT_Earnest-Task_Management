"use client";

import { useState } from "react";
import { api } from "@/lib/http";

interface TaskFormProps {
  onCreated: () => Promise<void> | void;
}

export default function TaskForm({ onCreated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!title.trim()) return;

    try {
      setLoading(true);
      await api.post("/tasks", { title: title.trim() });
      setTitle("");
      await onCreated();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task…"
        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
      />

      <button
        onClick={submit}
        disabled={loading || !title.trim()}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Adding…" : "Add"}
      </button>
    </div>
  );
}
