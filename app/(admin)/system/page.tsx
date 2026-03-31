"use client";

import { queueMetrics } from "@/lib/admin-data";

export default function AdminSystem() {
  const serviceChecks = [
    { service: "API Gateway", status: "healthy", detail: "p95 41ms" },
    { service: "Kafka Cluster", status: "healthy", detail: "ISR stable" },
    { service: "DLT Validator", status: "degraded", detail: "template cache warmup" },
    { service: "Billing Service", status: "healthy", detail: "no payment lag" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-black dark:text-white">
        System Health
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Service Status</h3>
          <div className="space-y-3">
            {serviceChecks.map((check) => (
              <div
                key={check.service}
                className="flex items-center justify-between py-3 border-b border-zinc-200 dark:border-zinc-800 last:border-0"
              >
                <div>
                  <p className="font-medium text-black dark:text-white">{check.service}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{check.detail}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    check.status === "healthy"
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                      : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100"
                  }`}
                >
                  {check.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Current Incident Window</h3>
          <div className="rounded-lg border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950 p-4">
            <p className="text-sm font-semibold text-orange-900 dark:text-orange-200">Bulk queue lag spike</p>
            <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
              Detected at 11:05 IST. Auto-throttle enabled, worker autoscale in progress.
            </p>
            <button className="mt-3 px-3 py-2 text-xs rounded bg-orange-600 text-white hover:bg-orange-700">
              Create incident report
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-black dark:text-white">Kafka Queue Health</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
              <tr className="text-zinc-600 dark:text-zinc-400 text-left">
                <th className="px-6 py-3 font-medium">Queue</th>
                <th className="px-6 py-3 font-medium">Lag</th>
                <th className="px-6 py-3 font-medium">Throughput</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {queueMetrics.map((queue) => (
                <tr
                  key={queue.name}
                  className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <td className="px-6 py-3 font-medium text-black dark:text-white">{queue.name}</td>
                  <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">{queue.lag.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">{queue.throughputPerSecond}/s</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        queue.status === "healthy"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                          : queue.status === "warning"
                            ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100"
                            : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100"
                      }`}
                    >
                      {queue.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
