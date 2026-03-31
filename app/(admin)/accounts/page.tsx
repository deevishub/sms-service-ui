"use client";

import { useMemo, useState } from "react";
import {
  adminAccounts,
  formatCompactNumber,
  formatCurrencyInr,
} from "@/lib/admin-data";

export default function AdminAccounts() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "suspended" | "review"
  >("all");

  const filteredAccounts = useMemo(() => {
    return adminAccounts.filter((account) => {
      const matchesSearch =
        account.company.toLowerCase().includes(search.toLowerCase()) ||
        account.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || account.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const lowBalanceAccounts = adminAccounts.filter(
    (account) => account.walletBalance < 15000,
  ).length;
  const reviewAccounts = adminAccounts.filter(
    (account) => account.status === "review",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Customer Accounts
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by company or email"
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white text-sm w-72"
          />
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as "all" | "active" | "suspended" | "review",
              )
            }
            className="px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white text-sm"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="review">Review</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Visible Accounts
          </p>
          <p className="text-2xl font-bold text-black dark:text-white">
            {filteredAccounts.length}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            KYC / Compliance Review
          </p>
          <p className="text-2xl font-bold text-yellow-600">{reviewAccounts}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Low Wallet Alerts
          </p>
          <p className="text-2xl font-bold text-red-600">
            {lowBalanceAccounts}
          </p>
        </div>
      </div>

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
                <th className="px-6 py-3 font-medium">Wallet</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((acc) => (
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
                          : acc.status === "review"
                            ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100"
                            : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100"
                      }`}
                    >
                      {acc.status.charAt(0).toUpperCase() + acc.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-black dark:text-white font-medium">
                    {formatCompactNumber(acc.messagesThisMonth)}
                  </td>
                  <td className="px-6 py-3 text-black dark:text-white font-medium">
                    {formatCurrencyInr(acc.walletBalance)}
                  </td>
                  <td className="px-6 py-3 text-zinc-600 dark:text-zinc-400">
                    {acc.joinedAt}
                  </td>
                  <td className="px-6 py-3">
                    <button className="text-blue-600 dark:text-blue-400 hover:underline text-xs mr-2">
                      View
                    </button>
                    <button className="text-orange-600 dark:text-orange-400 hover:underline text-xs mr-2">
                      {acc.status === "active" ? "Suspend" : "Activate"}
                    </button>
                    <button className="text-zinc-700 dark:text-zinc-300 hover:underline text-xs">
                      Reset API key
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
