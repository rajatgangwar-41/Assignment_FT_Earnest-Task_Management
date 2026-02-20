"use client";

import { api } from "@/lib/http";
import type { Task } from "@/types/task";
import { useState } from "react";

interface TaskItemProps {
  task: Task;
  onChange: (toastMessage?: string) => Promise<void> | void;
}

export default function TaskItem({ task, onChange }: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [saving, setSaving] = useState(false);

  async function toggle() {
    await api.patch(`/tasks/${task.id}/toggle`);
    await onChange("Task updated");
  }

  async function remove() {
    await api.delete(`/tasks/${task.id}`);
    await onChange("Task deleted");
  }

  async function save() {
    if (!title.trim()) return;

    try {
      setSaving(true);
      await api.patch(`/tasks/${task.id}`, { title: title.trim() });
      setEditing(false);
      await onChange("Task updated");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3 flex-1">
        <div
          className={`h-2.5 w-2.5 rounded-full ${
            task.completed ? "bg-green-500" : "bg-slate-300"
          }`}
        />

        {editing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 rounded border px-2 py-1 text-sm"
          />
        ) : (
          <span
            className={`text-sm ${
              task.completed ? "text-slate-400 line-through" : "text-slate-800"
            }`}
          >
            {task.title}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {editing ? (
          <>
            <button
              disabled={saving}
              onClick={save}
              className="rounded-md border px-3 py-1 text-xs"
            >
              Save
            </button>

            <button
              onClick={() => {
                setEditing(false);
                setTitle(task.title);
              }}
              className="rounded-md border px-3 py-1 text-xs"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="rounded-md border border-slate-200 px-3 py-1 text-xs"
            >
              Edit
            </button>

            <button
              onClick={toggle}
              className="rounded-md border border-slate-200 px-3 py-1 text-xs"
            >
              {task.completed ? "Undo" : "Done"}
            </button>

            <button
              onClick={remove}
              className="rounded-md border border-red-200 px-3 py-1 text-xs text-red-600"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
