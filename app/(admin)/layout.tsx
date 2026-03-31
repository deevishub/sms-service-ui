"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const sidebarItems = [
  { href: "/overview", label: "Overview", icon: "📊" },
  { href: "/accounts", label: "Accounts", icon: "👥" },
  { href: "/providers", label: "Providers", icon: "🌐" },
  { href: "/pricing", label: "Pricing", icon: "💰" },
  { href: "/dlt", label: "DLT Review", icon: "✅" },
  { href: "/financial", label: "Financial", icon: "📈" },
  { href: "/system", label: "System Health", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isItemActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-black">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            SMS Platform
          </h2>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-semibold">
            🔴 ADMIN PANEL
          </p>
        </div>

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
                        ? "bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100"
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

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <Link
            href="/dashboard"
            className="mb-2 w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
          >
            Switch to Customer
          </Link>
          <button className="w-full px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-xl font-semibold text-black dark:text-white">
            Admin Panel
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Last sync: {new Date().toLocaleTimeString()}
            </div>
            <Link
              href="/"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Back to Home
            </Link>
          </div>
        </div>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
