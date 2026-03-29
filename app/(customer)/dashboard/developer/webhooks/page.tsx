"use client";

export default function WebhooksPage() {
  const webhooks = [
    {
      id: "wh_001",
      url: "https://yourapp.com/webhooks/sms",
      events: ["message.status", "message.delivered"],
      active: true,
      lastTriggered: "Mar 28, 10:35",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Webhooks
        </h2>
        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
          Add Webhook
        </button>
      </div>

      {/* Add Webhook Form */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          Configure Webhook
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Webhook URL
            </label>
            <input
              type="url"
              placeholder="https://yourapp.com/webhooks/sms"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Must be HTTPS and publicly accessible
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Events
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  message.status — Delivery status updates
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  message.delivered — Confirmed delivery
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  message.failed — Delivery failures
                </span>
              </label>
            </div>
          </div>

          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
            Save Webhook
          </button>
        </div>
      </div>

      {/* Webhooks List */}
      <div className="space-y-4">
        {webhooks.map((wh) => (
          <div
            key={wh.id}
            className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm font-mono text-zinc-600 dark:text-zinc-400">
                  {wh.url}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Last triggered: {wh.lastTriggered}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  wh.active
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300"
                }`}
              >
                {wh.active ? "● Active" : "● Inactive"}
              </span>
            </div>
            <div className="flex gap-2">
              <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                Edit
              </button>
              <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                Test
              </button>
              <button className="text-red-600 dark:text-red-400 hover:underline text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
