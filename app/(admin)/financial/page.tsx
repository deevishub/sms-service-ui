"use client";

import {
  adminAccounts,
  formatCompactNumber,
  formatCurrencyInr,
  monthlyFinancialSummary,
} from "@/lib/admin-data";

export default function AdminFinancial() {
  const topSpenders = [...adminAccounts].sort(
    (a, b) => b.messagesThisMonth - a.messagesThisMonth
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-black dark:text-white">
        Financial Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Gross Revenue</p>
          <p className="text-xl font-bold text-black dark:text-white">
            {formatCurrencyInr(monthlyFinancialSummary.grossRevenueInr)}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Provider Cost</p>
          <p className="text-xl font-bold text-black dark:text-white">
            {formatCurrencyInr(monthlyFinancialSummary.providerCostInr)}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Gross Margin</p>
          <p className="text-xl font-bold text-green-600">
            {monthlyFinancialSummary.grossMarginPct.toFixed(2)}%
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Outstanding Credits</p>
          <p className="text-xl font-bold text-amber-600">
            {formatCurrencyInr(monthlyFinancialSummary.creditsOutstandingInr)}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Refunds</p>
          <p className="text-xl font-bold text-red-600">
            {formatCurrencyInr(monthlyFinancialSummary.refundsInr)}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          Margin Protection Rules
        </h3>
        <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          <li>1. Block automatic discounting below 6% margin on bulk routes.</li>
          <li>2. Flag enterprise custom rates when provider cost rises more than 4% week-over-week.</li>
          <li>3. Require finance approval for negative margin campaigns.</li>
        </ul>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-black dark:text-white">Top Usage Accounts (MTD)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
              <tr className="text-zinc-600 dark:text-zinc-400 text-left">
                <th className="px-6 py-3 font-medium">Account</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Messages</th>
                <th className="px-6 py-3 font-medium">Estimated Revenue</th>
                <th className="px-6 py-3 font-medium">Wallet</th>
              </tr>
            </thead>
            <tbody>
              {topSpenders.map((account) => {
                const estimatedRevenue = account.messagesThisMonth * 0.18;
                return (
                  <tr
                    key={account.id}
                    className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <td className="px-6 py-3 font-medium text-black dark:text-white">{account.company}</td>
                    <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300 capitalize">{account.plan}</td>
                    <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">
                      {formatCompactNumber(account.messagesThisMonth)}
                    </td>
                    <td className="px-6 py-3 font-medium text-black dark:text-white">
                      {formatCurrencyInr(estimatedRevenue)}
                    </td>
                    <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">
                      {formatCurrencyInr(account.walletBalance)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
