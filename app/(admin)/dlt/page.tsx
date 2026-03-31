"use client";

import { useMemo, useState } from "react";
import { dltSubmissions } from "@/lib/admin-data";

type DltDecision = "approved" | "rejected";

export default function AdminDLT() {
  const [decisions, setDecisions] = useState<Record<string, DltDecision>>({});

  const pendingCount = useMemo(
    () =>
      dltSubmissions.filter((submission) => !decisions[submission.id]).length,
    [decisions],
  );

  const highRiskCount = dltSubmissions.filter(
    (submission) => submission.riskFlags.length > 0,
  ).length;

  const setDecision = (id: string, decision: DltDecision) => {
    setDecisions((previous) => ({ ...previous, [id]: decision }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-black dark:text-white">
        DLT Review & Approval
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Pending Reviews
          </p>
          <p className="text-2xl font-bold text-black dark:text-white">
            {pendingCount}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            High Risk Flags
          </p>
          <p className="text-2xl font-bold text-red-600">{highRiskCount}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">SLA Target</p>
          <p className="text-2xl font-bold text-black dark:text-white">
            30 min
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
              <tr className="text-zinc-600 dark:text-zinc-400 text-left">
                <th className="px-6 py-3 font-medium">Company</th>
                <th className="px-6 py-3 font-medium">Sender ID</th>
                <th className="px-6 py-3 font-medium">Template</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Risk</th>
                <th className="px-6 py-3 font-medium">Submitted</th>
                <th className="px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {dltSubmissions.map((submission) => {
                const decision = decisions[submission.id];
                return (
                  <tr
                    key={submission.id}
                    className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <td className="px-6 py-3 font-medium text-black dark:text-white">
                      {submission.company}
                    </td>
                    <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">
                      {submission.senderId}
                    </td>
                    <td className="px-6 py-3 text-zinc-600 dark:text-zinc-400">
                      {submission.templateName}
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-1 rounded text-xs font-medium capitalize bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
                        {submission.messageType}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {submission.riskFlags.length === 0 ? (
                        <span className="text-green-600 text-xs font-medium">
                          No flags
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {submission.riskFlags.map((flag) => (
                            <span
                              key={flag}
                              className="px-2 py-1 rounded text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100"
                            >
                              {flag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3 text-zinc-600 dark:text-zinc-400">
                      {submission.submittedAt}
                    </td>
                    <td className="px-6 py-3">
                      {decision ? (
                        <span
                          className={`text-xs font-semibold ${
                            decision === "approved"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {decision.toUpperCase()}
                        </span>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setDecision(submission.id, "approved")
                            }
                            className="px-2 py-1 rounded text-xs bg-green-600 text-white hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              setDecision(submission.id, "rejected")
                            }
                            className="px-2 py-1 rounded text-xs bg-red-600 text-white hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      )}
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
