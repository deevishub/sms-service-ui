import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "DLT SMS Features for Enterprises",
  description:
    "Discover the key DLT SMS capabilities from Deevishub, including API access, delivery reporting, OTP routing, and compliance support.",
  keywords: [
    "DLT SMS features",
    "SMS API",
    "delivery reporting",
    "OTP messaging",
    "compliance support",
  ],
  openGraph: {
    title: "DLT SMS Features for Enterprises | Deevishub",
    description:
      "Discover the key DLT SMS capabilities from Deevishub, including API access, delivery reporting, OTP routing, and compliance support.",
    url: "https://sms.deevishub.com/features",
  },
};

const featureHighlights = [
  {
    title: "API access",
    detail: "REST APIs for sending, status checks, and template management.",
    icon: Zap,
  },
  {
    title: "OTP routes",
    detail:
      "Fast, secure delivery for authentication and verification workflows.",
    icon: ShieldCheck,
  },
  {
    title: "Promotional routes",
    detail: "High-volume broadcast support for marketing and campaign teams.",
    icon: Globe2,
  },
  {
    title: "Custom Sender IDs",
    detail: "Brand-specific sender identities for trusted customer messaging.",
    icon: Sparkles,
  },
  {
    title: "Delivery insights",
    detail: "Live reports for delivery status, retries, and failures.",
    icon: CheckCircle2,
  },
  {
    title: "DLT assistance",
    detail: "Guidance and onboarding support for compliance-ready campaigns.",
    icon: ShieldCheck,
  },
];

export default function FeaturesPage() {
  return (
    <div className="bg-white">
      <section className="px-4 pb-10 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            Features
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Everything your team needs to launch, monitor, and scale SMS
            operations
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Deevishub combines compliance support, fast routing, and operational
            visibility so your campaigns stay reliable from the first message to
            the last delivery update.
          </p>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featureHighlights.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card key={feature.title} className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-amber-50 p-2 text-amber-700">
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-semibold text-slate-900">
                      {feature.title}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {feature.detail}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[28px] bg-slate-900 px-6 py-8 text-white sm:px-10 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                Ready to compare plans?
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                Explore pricing that matches your messaging volume
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                View Pricing
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-amber-300 hover:text-amber-200"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
