"use client";

export default function BillingPage() {
  const transactions = [
    {
      id: "txn_001",
      type: "credit",
      amount: 10000,
      date: "Mar 25",
      desc: "Razorpay Top-up",
    },
    {
      id: "txn_002",
      type: "debit",
      amount: -45.5,
      date: "Mar 26",
      desc: "SMS Charges (250 msgs)",
    },
    {
      id: "txn_003",
      type: "debit",
      amount: -38.6,
      date: "Mar 27",
      desc: "SMS Charges (215 msgs)",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-black dark:text-white">
        Billing & Wallet
      </h2>

      {/* Wallet Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white p-8">
        <p className="text-sm opacity-75 mb-2">Current Balance</p>
        <h3 className="text-4xl font-bold mb-4">₹9,915.90</h3>
        <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50">
          Add Balance
        </button>
      </div>

      {/* Add Balance Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          Top-up Balance
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1000, 5000, 10000, 25000].map((amount) => (
              <button
                key={amount}
                className="p-4 border border-zinc-300 dark:border-zinc-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 text-center"
              >
                <p className="text-lg font-semibold text-black dark:text-white">
                  ₹{amount.toLocaleString()}
                </p>
              </button>
            ))}
          </div>
          <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
            Proceed to Payment
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          Transaction History
        </h3>
        <div className="space-y-3">
          {transactions.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center justify-between py-3 border-b border-zinc-200 dark:border-zinc-800 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-black dark:text-white">
                  {txn.desc}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {txn.date}
                </p>
              </div>
              <span
                className={`font-semibold ${
                  txn.type === "credit" ? "text-green-600" : "text-red-600"
                }`}
              >
                {txn.type === "credit" ? "+" : ""}
                {txn.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
