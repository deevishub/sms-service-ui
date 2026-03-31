"use client";

import { providerMetrics, queueMetrics } from "@/lib/admin-data";

export default function AdminProviders() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-black dark:text-white">
        Provider Management
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providerMetrics.map((provider, index) => (
          <div
            key={provider.name}
            className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-black dark:text-white">
                {provider.name}
              </h3>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  provider.status === "healthy"
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                    : provider.status === "degraded"
                      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100"
                      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100"
                }`}
              >
                ● {provider.status}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                  Route Policy
                </p>
                <p className="text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-2 rounded block truncate">
                  Priority {index + 1} with auto-failover
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                    Priority
                  </p>
                  <p className="text-lg font-semibold text-black dark:text-white">
                    {index + 1}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                    Cost/SMS
                  </p>
                  <p className="text-lg font-semibold text-black dark:text-white">
                    ₹{provider.costPerSmsInr.toFixed(2)}
                  </p>
                </div>
              </div>

              <button className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                Rebalance Route Weights
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          Real-time Health Metrics
        </h3>

        <div className="space-y-6">
          {providerMetrics.map((provider) => (
            <div
              key={provider.name}
              className="border-b border-zinc-200 dark:border-zinc-800 last:border-0 pb-6 last:pb-0"
            >
              <h4 className="font-semibold text-black dark:text-white mb-3">
                {provider.name}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                    Latency (p95)
                  </p>
                  <p className="text-lg font-semibold text-black dark:text-white">
                    {provider.latencyMs}ms
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                    Error Rate
                  </p>
                  <p className="text-lg font-semibold text-black dark:text-white">
                    {provider.errorRatePct.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                    Throughput
                  </p>
                  <p className="text-lg font-semibold text-black dark:text-white">
                    {provider.throughputMps} msg/s
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                    Uptime
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    {provider.uptimePct}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          Queue Backpressure Impact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {queueMetrics.map((queue) => (
            <div
              key={queue.name}
              className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4"
            >
              <p className="text-sm font-medium text-black dark:text-white">
                {queue.name}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Lag: {queue.lag} | Throughput: {queue.throughputPerSecond}/s
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
