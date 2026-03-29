"use client";

import { useState } from "react";

export default function MessageLogs() {
  const [filters, setFilters] = useState({
    status: "all",
    fromDate: "",
    toDate: "",
  });

  const messages = [
    {
      id: "msg_001",
      to: "+919876543210",
      status: "delivered",
      sent: "Mar 28, 10:30",
      senderId: "TD-MYBANK",
    },
    {
      id: "msg_002",
      to: "+919876543211",
      status: "delivered",
      sent: "Mar 28, 10:29",
      senderId: "TD-MYBANK",
    },
    {
      id: "msg_003",
      to: "+919876543212",
      status: "failed",
      sent: "Mar 28, 10:28",
      senderId: "TP-SHOP",
    },
    {
      id: "msg_004",
      to: "+919876543213",
      status: "pending",
      sent: "Mar 28, 10:27",
      senderId: "TD-MYBANK",
    },
    {
      id: "msg_005",
      to: "+919876543214",
      status: "delivered",
      sent: "Mar 28, 10:26",
      senderId: "TP-SHOP",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
        Message Logs
      </h2>

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white text-sm"
            >
              <option value="all">All</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) =>
                setFilters({ ...filters, fromDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) =>
                setFilters({ ...filters, toDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white text-sm"
            />
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm">
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
              <tr className="text-zinc-600 dark:text-zinc-400 text-left">
                <th className="px-6 py-3 font-medium">Message ID</th>
                <th className="px-6 py-3 font-medium">To</th>
                <th className="px-6 py-3 font-medium">Sender ID</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Sent At</th>
                <th className="px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr
                  key={msg.id}
                  className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <td className="px-6 py-3 font-mono text-xs">{msg.id}</td>
                  <td className="px-6 py-3">{msg.to}</td>
                  <td className="px-6 py-3">{msg.senderId}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        msg.status === "delivered"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                          : msg.status === "failed"
                          ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100"
                          : "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100"
                      }`}
                    >
                      {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-3">{msg.sent}</td>
                  <td className="px-6 py-3">
                    <button className="text-blue-600 dark:text-blue-400 hover:underline text-xs">
                      View
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
