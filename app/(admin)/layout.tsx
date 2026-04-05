"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { ThemeToggle } from "@/components/theme-toggle";

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
      <aside className="flex w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-zinc-200 p-6 dark:border-zinc-800">
          <div className="rounded-2xl bg-black p-3">
            <Image
              src="/DEEVISHUB_WOB_1500X500.png"
              alt="DeevisHub"
              width={138}
              height={46}
              priority
              className="h-auto w-auto"
            />
          </div>
          <p className="mt-3 text-xs font-semibold text-red-600 dark:text-red-400">
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
                      "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100"
                        : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
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

        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <Link
            href="/dashboard"
            className="mb-2 inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Switch to Customer
          </Link>
          <button className="w-full rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-200 bg-white px-8 py-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-xl font-semibold text-black dark:text-white">
            Admin Panel
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Last sync: {new Date().toLocaleTimeString()}
            </div>
            <ThemeToggle />
            <Link
              href="/"
              className="text-sm text-amber-600 hover:underline dark:text-amber-400"
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
