"use client";

import {
  adminAccounts,
  dltSubmissions,
  formatCompactNumber,
  formatCurrencyInr,
  monthlyFinancialSummary,
  providerMetrics,
  queueMetrics,
} from "@/lib/admin-data";

export default function AdminOverview() {
  const activeAccounts = adminAccounts.filter(
    (acc) => acc.status === "active",
  ).length;
  const totalMessages = adminAccounts.reduce(
    (total, account) => total + account.messagesThisMonth,
    0,
  );
  const avgDeliveryRate =
    providerMetrics.reduce(
      (total, provider) => total + (100 - provider.errorRatePct),
      0,
    ) / providerMetrics.length;
  const criticalQueues = queueMetrics.filter(
    (queue) => queue.status === "critical",
  ).length;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-black dark:text-white">
        Platform Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            Active Accounts
          </p>
          <p className="text-3xl font-bold text-black dark:text-white">
            {activeAccounts}
          </p>
          <p className="text-xs text-green-600 mt-2">
            Includes live API customers
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            Messages This Month
          </p>
          <p className="text-3xl font-bold text-black dark:text-white">
            {formatCompactNumber(totalMessages)}
          </p>
          <p className="text-xs text-green-600 mt-2">
            Across all account plans
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            Weighted Delivery Rate
          </p>
          <p className="text-3xl font-bold text-black dark:text-white">
            {avgDeliveryRate.toFixed(1)}%
          </p>
          <p className="text-xs text-green-600 mt-2">
            Computed from provider error rates
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            MTD Gross Revenue
          </p>
          <p className="text-3xl font-bold text-black dark:text-white">
            {formatCurrencyInr(monthlyFinancialSummary.grossRevenueInr)}
          </p>
          <p className="text-xs text-green-600 mt-2">
            Margin {monthlyFinancialSummary.grossMarginPct.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Operational Alerts
          </h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-900">
              <p className="font-medium text-yellow-900 dark:text-yellow-200">
                Queue pressure detected
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                {criticalQueues} critical queue requires rate throttling or
                worker scale-out.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900">
              <p className="font-medium text-red-900 dark:text-red-200">
                DLT review backlog
              </p>
              <p className="text-red-700 dark:text-red-300 mt-1">
                {
                  dltSubmissions.filter((item) => item.riskFlags.length > 0)
                    .length
                }{" "}
                submissions need compliance escalation.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Provider Health Snapshot
          </h3>
          <div className="space-y-3">
            {providerMetrics.map((provider) => (
              <div
                key={provider.name}
                className="flex items-center justify-between py-3 border-b border-zinc-200 dark:border-zinc-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      provider.status === "healthy"
                        ? "bg-green-500"
                        : provider.status === "degraded"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  ></div>
                  <span className="font-medium text-black dark:text-white">
                    {provider.name}
                  </span>
                </div>
                <div className="flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
                  <span>{provider.latencyMs}ms p95</span>
                  <span>{provider.errorRatePct.toFixed(1)}% error</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
              {adminAccounts.slice(0, 3).map((account) => (
                <tr
                  key={account.id}
                  className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <td className="py-3 px-4 font-medium text-black dark:text-white">
                    {account.company}
                  </td>
                  <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                    {account.email}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 capitalize">
                      {account.plan}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                    {account.joinedAt}
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
