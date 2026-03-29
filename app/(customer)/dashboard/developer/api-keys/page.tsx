"use client";

import { useState } from "react";

export default function APIKeysPage() {
  const [showKey, setShowKey] = useState(false);
  const [keys, setKeys] = useState([
    {
      id: "ak_live_abc123",
      name: "Production Key",
      createdAt: "Mar 20, 2024",
      lastUsed: "Mar 28, 2024",
      rateLimit: 100,
    },
    {
      id: "ak_test_xyz789",
      name: "Testing Key",
      createdAt: "Mar 15, 2024",
      lastUsed: "Mar 27, 2024",
      rateLimit: 50,
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          API Keys
        </h2>
        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
          Generate New Key
        </button>
      </div>

      {/* Create New Key Modal (placeholder) */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100">
          Create a New API Key
        </h3>
        <div>
          <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
            Key Name
          </label>
          <input
            type="text"
            placeholder="e.g., Mobile App Integration"
            className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-blue-900 text-black dark:text-white text-sm"
          />
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm">
          Create Key
        </button>
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        {keys.map((key) => (
          <div
            key={key.id}
            className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-black dark:text-white">
                  {key.name}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Created {key.createdAt}
                </p>
              </div>
              <button className="text-red-600 dark:text-red-400 hover:text-red-700 text-sm font-medium">
                Delete
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                  Key ID
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded text-sm font-mono text-black dark:text-white">
                    {key.id}
                  </code>
                  <button className="px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-sm">
                    📋
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                  Secret Key
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type={showKey ? "text" : "password"}
                    value="sk_live_••••••••••••••••"
                    readOnly
                    className="flex-1 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded text-sm font-mono text-black dark:text-white cursor-not-allowed"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-sm"
                  >
                    {showKey ? "👁️" : "🔒"}
                  </button>
                </div>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  ⚠️ Never share your secret key!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 text-sm text-zinc-600 dark:text-zinc-400 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <p>
                Rate Limit:{" "}
                <span className="font-medium text-black dark:text-white">
                  {key.rateLimit} req/sec
                </span>
              </p>
              <p>
                Last Used:{" "}
                <span className="font-medium text-black dark:text-white">
                  {key.lastUsed}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
