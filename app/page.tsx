import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const features = [
  {
    title: "Campaign Dispatch",
    description:
      "Launch telemarketing SMS campaigns quickly with a focused send workflow and high-volume delivery support.",
    icon: "📨",
  },
  {
    title: "Live Delivery Logs",
    description:
      "Track message status, failures, and outcomes in one customer workspace without jumping between tools.",
    icon: "📊",
  },
  {
    title: "Billing Visibility",
    description:
      "Keep an eye on wallet balance, usage, and recharge activity as your team works through campaigns.",
    icon: "💳",
  },
  {
    title: "Developer Ready",
    description:
      "Manage API keys and webhooks whenever your telemarketing workflows need deeper integration.",
    icon: "⚙️",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-background to-background dark:from-[#1a1307] dark:via-[#050505] dark:to-[#050505]">
      <nav className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/70">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-2xl px-3 py-2 shadow-lg shadow-amber-500/10">
              <Image
                src="/DEEVISHUB_132X44.png"
                alt="DeevisHub"
                width={132}
                height={44}
                priority
                className="h-auto w-auto"
              />
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-700 dark:text-amber-300">
              Built for telemarketers
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl dark:text-white">
              Run SMS outreach from one focused customer workspace
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
              DeevisHub brings campaign sending, delivery tracking, billing, and
              developer tools together in a clean dashboard designed for
              fast-moving telemarketing teams.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400"
              >
                Sign In to Dashboard
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-3 font-semibold text-zinc-700 transition hover:border-amber-500 hover:text-amber-600 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-amber-400 dark:hover:text-amber-300"
              >
                View Features
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-black/5 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-950/70">
                <p className="text-2xl font-bold text-zinc-950 dark:text-white">
                  24/7
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  delivery visibility
                </p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-950/70">
                <p className="text-2xl font-bold text-zinc-950 dark:text-white">
                  1 Click
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  customer sign-in flow
                </p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-950/70">
                <p className="text-2xl font-bold text-zinc-950 dark:text-white">
                  Light/Dark
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  theme switching
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-black/5 bg-white/80 p-6 shadow-2xl shadow-amber-500/10 dark:border-white/10 dark:bg-zinc-950/80">
            <div className="rounded-3xl bg-black p-6">
              <Image
                src="/DEEVISHUB_320X132.png"
                alt="DeevisHub brand logo"
                width={300}
                height={100}
                className="h-auto w-full"
              />
            </div>

            <div className="mt-6 space-y-3">
              {[
                "Signing in now opens the customer dashboard directly.",
                "The landing page no longer shows workspace selection.",
                "Free-trial messaging has been removed for a telemarketer-first experience.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-amber-500/10 px-4 py-3 text-sm text-zinc-700 dark:text-zinc-200"
                >
                  <span className="mt-0.5 text-amber-600 dark:text-amber-300">
                    ✦
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-zinc-950 dark:text-white">
              Everything a telemarketing team needs
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              A customer-first workflow powered by DeevisHub branding and a
              theme-aware interface.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-black/5 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950/70"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-xl text-black">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[28px] bg-black p-8 text-center text-white shadow-2xl shadow-amber-500/15 sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
            DeevisHub Customer Access
          </p>
          <h2 className="mt-4 text-3xl font-bold">
            Ready to continue your SMS operations?
          </h2>
          <p className="mt-3 text-zinc-300">
            Open the customer dashboard directly and manage sends, logs, and
            balance from one place.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400"
          >
            Open Customer Dashboard
          </Link>
        </div>
      </section>

      <footer className="border-t border-black/5 px-4 py-8 text-sm text-zinc-600 dark:border-white/10 dark:text-zinc-400 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 DeevisHub. Telemarketing SMS workspace.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="hover:text-amber-600 dark:hover:text-amber-300"
            >
              Customer Dashboard
            </Link>
            <Link
              href="#features"
              className="hover:text-amber-600 dark:hover:text-amber-300"
            >
              Features
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
