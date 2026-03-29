"use client";

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            Messages Today
          </p>
          <p className="text-3xl font-bold text-black dark:text-white">1,234</p>
          <p className="text-xs text-green-600 mt-2">↑ 12% from yesterday</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            Delivery Rate
          </p>
          <p className="text-3xl font-bold text-black dark:text-white">96.5%</p>
          <p className="text-xs text-green-600 mt-2">↑ 2.1% from last week</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            Wallet Balance
          </p>
          <p className="text-3xl font-bold text-black dark:text-white">
            ₹5,200
          </p>
          <p className="text-xs text-orange-600 mt-2">⚠️ Low balance alert</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            This Month Spend
          </p>
          <p className="text-3xl font-bold text-black dark:text-white">
            ₹12,450
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
            Avg cost: ₹0.18/SMS
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Message Volume (Last 7 Days)
          </h3>
          <div className="h-64 bg-zinc-50 dark:bg-zinc-800 rounded flex items-center justify-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              Chart component will render here
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Message Status
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Delivered
                </span>
                <span className="font-medium text-black dark:text-white">
                  96.5%
                </span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "96.5%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-600 dark:text-zinc-400">Failed</span>
                <span className="font-medium text-black dark:text-white">
                  2.1%
                </span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: "2.1%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Pending
                </span>
                <span className="font-medium text-black dark:text-white">
                  1.4%
                </span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: "1.4%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          Recent Messages
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 dark:border-zinc-800">
              <tr className="text-zinc-600 dark:text-zinc-400 text-left">
                <th className="pb-3 px-4">To</th>
                <th className="pb-3 px-4">Message</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4">Sent At</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr
                  key={i}
                  className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <td className="py-3 px-4">+91 9876543210</td>
                  <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 truncate">
                    Your OTP is 123456. Valid for 5 minutes.
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                      Delivered
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                    Mar 28, 10:30
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
