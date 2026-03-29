"use client";

export default function AdminOverview() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-black dark:text-white">
        Platform Overview
      </h2>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            Active Accounts
          </p>
          <p className="text-3xl font-bold text-black dark:text-white">1,247</p>
          <p className="text-xs text-green-600 mt-2">↑ 42 this month</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            Messages Today
          </p>
          <p className="text-3xl font-bold text-black dark:text-white">2.3M</p>
          <p className="text-xs text-green-600 mt-2">↑ 15% from yesterday</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            Avg Delivery Rate
          </p>
          <p className="text-3xl font-bold text-black dark:text-white">96.8%</p>
          <p className="text-xs text-green-600 mt-2">↑ 0.5% from last week</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            This Month Revenue
          </p>
          <p className="text-3xl font-bold text-black dark:text-white">₹4.2L</p>
          <p className="text-xs text-green-600 mt-2">↑ 28% from last month</p>
        </div>
      </div>

      {/* Provider Health */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          Provider Health
        </h3>
        <div className="space-y-3">
          {[
            {
              name: "MSG91",
              status: "healthy",
              latency: "120ms",
              deliveryRate: "97.2%",
            },
            {
              name: "Gupshup",
              status: "healthy",
              latency: "140ms",
              deliveryRate: "96.5%",
            },
            {
              name: "Twilio",
              status: "degraded",
              latency: "450ms",
              deliveryRate: "88.3%",
            },
          ].map((provider) => (
            <div
              key={provider.name}
              className="flex items-center justify-between py-3 border-b border-zinc-200 dark:border-zinc-800 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    provider.status === "healthy"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                ></div>
                <span className="font-medium text-black dark:text-white">
                  {provider.name}
                </span>
              </div>
              <div className="flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
                <span>
                  Latency:{" "}
                  <span className="font-medium text-black dark:text-white">
                    {provider.latency}
                  </span>
                </span>
                <span>
                  Delivery:{" "}
                  <span className="font-medium text-black dark:text-white">
                    {provider.deliveryRate}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Accounts */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          Recent Signups
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 dark:border-zinc-800">
              <tr className="text-zinc-600 dark:text-zinc-400 text-left">
                <th className="pb-3 px-4">Company</th>
                <th className="pb-3 px-4">Email</th>
                <th className="pb-3 px-4">Plan</th>
                <th className="pb-3 px-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr
                  key={i}
                  className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <td className="py-3 px-4 font-medium text-black dark:text-white">
                    Company {i}
                  </td>
                  <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                    user{i}@example.com
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
                      Starter
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                    Mar 26, 2024
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
