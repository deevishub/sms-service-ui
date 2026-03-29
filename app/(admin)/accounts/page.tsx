"use client";

import { useState } from "react";

export default function AdminAccounts() {
  const [accounts] = useState([
    {
      id: "acc_001",
      company: "TechStarUp Inc",
      email: "admin@techstartup.com",
      plan: "growth",
      status: "active",
      messagesThisMonth: 450000,
      joinedAt: "Jan 15, 2024",
    },
    {
      id: "acc_002",
      company: "E-Mart Solutions",
      email: "billing@emart.com",
      plan: "business",
      status: "active",
      messagesThisMonth: 1200000,
      joinedAt: "Feb 20, 2024",
    },
    {
      id: "acc_003",
      company: "Offline Company",
      email: "contact@offline.com",
      plan: "starter",
      status: "suspended",
      messagesThisMonth: 0,
      joinedAt: "Mar 10, 2024",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Customer Accounts
        </h2>
        <input
          type="text"
          placeholder="Search accounts..."
          className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white text-sm w-80"
        />
      </div>

      {/* Accounts Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
              <tr className="text-zinc-600 dark:text-zinc-400 text-left">
                <th className="px-6 py-3 font-medium">Company</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Messages (MTD)</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => (
                <tr
                  key={acc.id}
                  className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <td className="px-6 py-3 font-medium text-black dark:text-white">
                    {acc.company}
                  </td>
                  <td className="px-6 py-3 text-zinc-600 dark:text-zinc-400">
                    {acc.email}
                  </td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 capitalize">
                      {acc.plan}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        acc.status === "active"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100"
                      }`}
                    >
                      {acc.status.charAt(0).toUpperCase() + acc.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-black dark:text-white font-medium">
                    {(acc.messagesThisMonth / 1000000).toFixed(1)}M
                  </td>
                  <td className="px-6 py-3 text-zinc-600 dark:text-zinc-400">
                    {acc.joinedAt}
                  </td>
                  <td className="px-6 py-3">
                    <button className="text-blue-600 dark:text-blue-400 hover:underline text-xs mr-2">
                      View
                    </button>
                    <button className="text-orange-600 dark:text-orange-400 hover:underline text-xs">
                      {acc.status === "active" ? "Suspend" : "Activate"}
                    </button>
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
