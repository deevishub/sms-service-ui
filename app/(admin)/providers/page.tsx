"use client";

export default function AdminProviders() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-black dark:text-white">
        Provider Management
      </h2>

      {/* Configure Providers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            name: "MSG91",
            status: "configured",
            apiKeyPrefix: "sk_live_****",
            priority: 1,
            costPerSMS: "0.12",
          },
          {
            name: "Gupshup",
            status: "configured",
            apiKeyPrefix: "api_key_****",
            priority: 2,
            costPerSMS: "0.14",
          },
        ].map((provider) => (
          <div
            key={provider.name}
            className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-black dark:text-white">
                {provider.name}
              </h3>
              <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                ● Configured
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                  API Key
                </p>
                <code className="text-sm font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-2 rounded block truncate">
                  {provider.apiKeyPrefix}
                </code>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                    Priority
                  </p>
                  <p className="text-lg font-semibold text-black dark:text-white">
                    {provider.priority}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                    Cost/SMS
                  </p>
                  <p className="text-lg font-semibold text-black dark:text-white">
                    ₹{provider.costPerSMS}
                  </p>
                </div>
              </div>

              <button className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                Edit Configuration
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Provider Health & Metrics */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          Real-time Health Metrics
        </h3>

        <div className="space-y-6">
          {[
            {
              name: "MSG91",
              latency: "125ms",
              errorRate: "1.2%",
              throughput: "8450 MSG/s",
              uptime: "99.97%",
            },
            {
              name: "Gupshup",
              latency: "155ms",
              errorRate: "2.1%",
              throughput: "3220 MSG/s",
              uptime: "99.95%",
            },
          ].map((provider) => (
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
                    {provider.latency}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                    Error Rate
                  </p>
                  <p className="text-lg font-semibold text-black dark:text-white">
                    {provider.errorRate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                    Throughput
                  </p>
                  <p className="text-lg font-semibold text-black dark:text-white">
                    {provider.throughput}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                    Uptime
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    {provider.uptime}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
