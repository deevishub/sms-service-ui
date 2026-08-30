import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PricingCard } from "@/components/pricing-card";

export const metadata: Metadata = {
  title: "SMS Pricing for Enterprises",
  description:
    "Compare Deevishub SMS plans for startups, scaling teams, and enterprises with transparent pricing and DLT-ready messaging capabilities.",
  keywords: [
    "SMS pricing",
    "bulk SMS plans",
    "enterprise SMS pricing",
    "DLT messaging plans",
    "SMS packages",
  ],
  openGraph: {
    title: "SMS Pricing for Enterprises | Deevishub",
    description:
      "Compare Deevishub SMS plans for startups, scaling teams, and enterprises with transparent pricing and DLT-ready messaging capabilities.",
    url: "https://sms.deevishub.com/pricing",
  },
};

const pricingPlans = [
  {
    title: "Starter",
    price: "₹999",
    smsVolume: "1,200 SMS / month",
    features: [
      "Promotional and transactional route access",
      "Shared sender ID support",
      "Basic delivery analytics",
      "Email support",
    ],
  },
  {
    title: "Growth",
    price: "₹2,499",
    smsVolume: "5,000 SMS / month",
    features: [
      "Dedicated onboarding and campaign guidance",
      "Priority delivery routing",
      "Advanced delivery reports",
      "API access for integrations",
    ],
  },
  {
    title: "Enterprise",
    price: "Custom",
    smsVolume: "High-volume transactional workflows",
    features: [
      "Custom sender IDs and SLAs",
      "Dedicated account manager",
      "High-priority routing and escalations",
      "Compliance support and custom reporting",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="bg-white">
      <section className="px-4 pb-10 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            Pricing
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Flexible SMS plans for local teams, scaling startups, and enterprise
            operations.
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Choose the plan that matches your messaging volume and launch with
            confidence using enterprise-grade infrastructure and transparent
            pricing.
          </p>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.title}
              title={plan.title}
              price={plan.price}
              smsVolume={plan.smsVolume}
              features={plan.features}
            />
          ))}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[28px] bg-slate-900 px-6 py-8 text-white sm:px-10 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                Want to compare capabilities first?
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                Review the platform features before choosing your plan
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Explore Features
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="https://sms.deevishub.com/docs/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-amber-300 hover:text-amber-200"
              >
                View API Docs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
