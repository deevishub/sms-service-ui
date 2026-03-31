import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SMS</span>
              </div>
              <span className="text-white font-semibold">SMS Platform</span>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Send SMS at Scale
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Reliable bulk SMS service with real-time delivery tracking, DLT
            compliance, and powerful APIs. Perfect for OTPs, notifications, and
            campaigns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Start Free Trial
            </Link>
            <Link
              href="/login"
              className="border border-slate-500 text-white px-8 py-3 rounded-lg hover:bg-slate-800 transition-colors font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-800/50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Features
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl">📨</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Bulk SMS
              </h3>
              <p className="text-slate-400">
                Send thousands of messages instantly with our high-throughput
                infrastructure.
              </p>
            </div>
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Real-time Tracking
              </h3>
              <p className="text-slate-400">
                Monitor delivery status, DLRs, and bounce rates in real time.
              </p>
            </div>
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                DLT Compliant
              </h3>
              <p className="text-slate-400">
                Fully compliant with TRAI DLT regulations and entity
                verification.
              </p>
            </div>
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl">⚙️</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Powerful API
              </h3>
              <p className="text-slate-400">
                Simple REST API with SDKs for Node.js, Python, and more.
              </p>
            </div>
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Pay as You Go
              </h3>
              <p className="text-slate-400">
                Transparent pricing with no hidden fees. Only pay for what you
                send.
              </p>
            </div>
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl">🛡️</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Enterprise Ready
              </h3>
              <p className="text-slate-400">
                99.9% uptime SLA, 24/7 support, and API rate limits up to 10,000
                msgs/sec.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-blue-100 mb-8">
            Sign up for free and send your first SMS in minutes.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Select Your Workspace
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/overview"
              className="rounded-xl border border-red-400/40 bg-red-950/40 p-6 hover:bg-red-900/50 transition-colors"
            >
              <p className="text-sm uppercase tracking-wide text-red-300 mb-2">
                Internal Operations
              </p>
              <h3 className="text-xl font-semibold text-white">Admin Console</h3>
              <p className="text-slate-300 mt-2 text-sm">
                Manage accounts, compliance approvals, routing, pricing, and system health.
              </p>
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-blue-400/40 bg-blue-950/40 p-6 hover:bg-blue-900/50 transition-colors"
            >
              <p className="text-sm uppercase tracking-wide text-blue-300 mb-2">
                Customer Experience
              </p>
              <h3 className="text-xl font-semibold text-white">Customer Dashboard</h3>
              <p className="text-slate-300 mt-2 text-sm">
                Send SMS, monitor delivery, manage billing, and use developer tools.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid sm:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    API Docs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Developers</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
            <p>&copy; 2026 SMS Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
