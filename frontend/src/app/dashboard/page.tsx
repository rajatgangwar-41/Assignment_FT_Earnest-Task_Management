"use client";

import type { Task } from "@/types/task";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/http";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import Toast from "@/components/Toast";

type StatusFilter = "all" | "completed" | "pending";

interface TasksResponse {
  items: Task[];
  page: number;
  limit: number;
  total: number;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 5;

  const [status, setStatus] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const [total, setTotal] = useState(0);

  const [toast, setToast] = useState<string | null>(null);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  }

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get<TasksResponse>("/tasks", {
        params: {
          page,
          limit,
          status: status === "all" ? undefined : status,
          search: search || undefined,
        },
      });

      setTasks(res.data.items);
      setTotal(res.data?.total ?? res.data.items.length);
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, search]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-screen bg-slate-50">
      {toast && <Toast message={toast} />}

      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-900">My Tasks</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your daily work</p>

        {/* controls */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search task..."
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />

          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value as StatusFilter);
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="mt-6">
          <TaskForm
            onCreated={async () => {
              await load();
              showToast("Task created");
            }}
          />
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="text-sm text-slate-500">Loading…</div>
          ) : (
            <TaskList
              tasks={tasks}
              onChange={async (msg?: string) => {
                await load();
                if (msg) showToast(msg);
              }}
            />
          )}
        </div>

        {/* pagination */}
        <div className="mt-6 flex items-center justify-between text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-slate-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
