import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const trustMetrics = [
  {
    title: "99.9% Uptime",
    description:
      "High-availability infrastructure with fast failover and route stability.",
    icon: ShieldCheck,
  },
  {
    title: "Direct Operator Connectivity",
    description:
      "Faster delivery with optimized routing across SMS operators and gateways.",
    icon: Globe2,
  },
  {
    title: "Free DLT Assistance",
    description:
      "Guidance for onboarding, templates, and compliance setup across campaigns.",
    icon: Sparkles,
  },
];

const howItWorks = [
  {
    title: "Create Account",
    description:
      "Share your business details and get your sender workflows configured quickly.",
  },
  {
    title: "Add Credits",
    description:
      "Load your plan and choose the right SMS volume for your team and use case.",
  },
  {
    title: "Launch Campaigns",
    description:
      "Send OTPs, promos, and transactional updates with live delivery status.",
  },
];

const developerHighlights = [
  "REST APIs for sending, status checks, and template management.",
  "Sample payloads and developer documentation for fast onboarding.",
  "Campaign analytics and delivery visibility for operators and support teams.",
];

export default function Home() {
  return (
    <div className="bg-white">
      <section className="px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
              Fast, reliable bulk SMS for modern business teams
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Reliable Bulk SMS for Growing Businesses
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Deevishub helps teams send high-volume SMS at speed with
              dependable routing, real-time delivery insights, and
              developer-friendly API access.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                View Pricing
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-amber-400 hover:text-amber-700"
              >
                Talk to Sales
              </Link>
              <Link
                href="https://sms.deevishub.com/docs/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-6 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
              >
                API Docs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-700">
              <span className="rounded-full bg-slate-100 px-4 py-2">
                Bulk SMS
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2">
                OTP & Transactional
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2">
                API Integrations
              </span>
            </div>
          </div>

          <Card className="border-slate-200 bg-gradient-to-br from-amber-50 to-white p-1 shadow-lg">
            <CardContent className="rounded-[26px] bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
                Developer integration
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Built for teams that want dependable delivery and fast
                onboarding
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Move from first integration to live campaigns with documented
                APIs, clear routing, and support for expansion across teams and
                channels.
              </p>

              <div className="mt-6 space-y-3">
                {developerHighlights.map((point) => (
                  <div
                    key={point}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
                  >
                    <CheckCircle2 className="mb-2 h-4 w-4 text-amber-600" />
                    {point}
                  </div>
                ))}
              </div>

              <Link
                href="https://sms.deevishub.com/docs/"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                View API Docs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[28px] bg-slate-900 px-5 py-6 text-white sm:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {trustMetrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <div
                  key={metric.title}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5"
                >
                  <Icon className="h-5 w-5 text-amber-300" />
                  <p className="mt-3 text-lg font-semibold">{metric.title}</p>
                  <p className="mt-2 text-sm text-slate-200">
                    {metric.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              A simple path to reliable campaign delivery
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {howItWorks.map((step, index) => (
              <Card key={step.title} className="border-slate-200">
                <CardContent className="p-6">
                  <p className="text-sm font-semibold text-amber-600">
                    0{index + 1}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[28px] bg-gradient-to-r from-amber-500 to-orange-400 px-6 py-8 text-center text-slate-950 sm:px-10 sm:py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]">
            Start sending today
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Ready to launch smarter SMS campaigns?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-800 sm:text-base">
            From onboarding to campaign execution, Deevishub gives your team the
            tools to move faster, stay compliant, and scale with confidence.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Explore Plans
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white/50"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
