"use client";

import { accountOverrides, pricingPlans } from "@/lib/admin-data";

export default function AdminPricing() {
  const blendedMargin =
    pricingPlans.reduce((total, plan) => total + plan.markupPct, 0) /
    pricingPlans.length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-black dark:text-white">
        Pricing Configuration
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Pricing Tiers
          </p>
          <p className="text-2xl font-bold text-black dark:text-white">
            {pricingPlans.length}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Account Overrides
          </p>
          <p className="text-2xl font-bold text-black dark:text-white">
            {accountOverrides.length}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Blended Target Margin
          </p>
          <p className="text-2xl font-bold text-green-600">
            {blendedMargin.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Tiered Plan Matrix
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
              <tr className="text-zinc-600 dark:text-zinc-400 text-left">
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Base Rate</th>
                <th className="px-6 py-3 font-medium">Markup</th>
                <th className="px-6 py-3 font-medium">Free Messages</th>
                <th className="px-6 py-3 font-medium">Effective Rate</th>
              </tr>
            </thead>
            <tbody>
              {pricingPlans.map((plan) => (
                <tr
                  key={plan.plan}
                  className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <td className="px-6 py-3 font-medium text-black dark:text-white capitalize">
                    {plan.plan}
                  </td>
                  <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">
                    ₹{plan.baseRate.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">
                    {plan.markupPct}%
                  </td>
                  <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">
                    {plan.freeMessages.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-3 font-semibold text-black dark:text-white">
                    ₹{(plan.baseRate * (1 + plan.markupPct / 100)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Enterprise Overrides
          </h3>
          <button className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            Add Override
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
              <tr className="text-zinc-600 dark:text-zinc-400 text-left">
                <th className="px-6 py-3 font-medium">Account</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Route</th>
                <th className="px-6 py-3 font-medium">Custom Rate</th>
                <th className="px-6 py-3 font-medium">Margin</th>
              </tr>
            </thead>
            <tbody>
              {accountOverrides.map((override) => (
                <tr
                  key={override.account}
                  className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <td className="px-6 py-3 font-medium text-black dark:text-white">
                    {override.account}
                  </td>
                  <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300 capitalize">
                    {override.plan}
                  </td>
                  <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">
                    {override.route}
                  </td>
                  <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">
                    ₹{override.customRate.toFixed(2)}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`text-xs font-semibold ${
                        override.marginPct < 7
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {override.marginPct.toFixed(1)}%
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
