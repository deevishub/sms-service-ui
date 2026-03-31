"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const sidebarItems = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: "📊",
  },
  {
    href: "/dashboard/sms/send",
    label: "Send SMS",
    icon: "📨",
  },
  {
    href: "/dashboard/sms/logs",
    label: "Message Logs",
    icon: "📋",
  },
  {
    href: "/dashboard/billing",
    label: "Billing",
    icon: "💳",
  },
  {
    href: "/dashboard/developer/api-keys",
    label: "API Keys",
    icon: "🔑",
  },
  {
    href: "/dashboard/developer/webhooks",
    label: "Webhooks",
    icon: "🪝",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: "⚙️",
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isItemActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            SMS Platform
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Customer Dashboard
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = isItemActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    )}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <Link
            href="/overview"
            className="mb-2 w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
          >
            Switch to Admin
          </Link>
          <button className="w-full px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-black dark:text-white">
            Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Balance: ₹5,200.00
            </span>
            <Link href="/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Home
            </Link>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
              Add Balance
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
