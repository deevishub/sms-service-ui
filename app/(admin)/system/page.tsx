"use client";

export default function AdminSystem() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-black dark:text-white">
        System Health
      </h2>
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-8 text-center text-zinc-600 dark:text-zinc-400">
        <p>System health monitoring — Coming Soon</p>
        <p className="text-sm mt-2">
          Queue depths, worker lag, errors, and alerts here
        </p>
      </div>
    </div>
  );
}
