import { BarChart3, Globe2, ShieldCheck, Smartphone, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { COMPANY_CIN, COMPANY_NAME } from "@/lib/constants";

const reasons = [
  {
    title: "Zero Setup Cost",
    description:
      "Get started without hidden onboarding, setup, or implementation fees.",
    icon: Smartphone,
  },
  {
    title: "Real-time Delivery Reports",
    description:
      "Monitor campaign status, failures, and delivery trends from one live dashboard.",
    icon: BarChart3,
  },
  {
    title: "Developer-Friendly APIs",
    description:
      "Integrate with CRMs, support platforms, and custom workflows with clean API access.",
    icon: Zap,
  },
  {
    title: "Local Support & Campaign Management",
    description:
      "Work with a responsive support team that helps you plan, launch, and optimize SMS campaigns.",
    icon: Globe2,
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="px-4 pb-10 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            About {COMPANY_NAME}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Transparent, high-speed telecom solutions for businesses that need
            clarity and speed.
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Deevishub exists to make bulk SMS simpler. We combine dependable
            routing, clean delivery reporting, and compliance support so teams
            can focus on customer communication and growth instead of telecom
            complexity.
          </p>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <Card key={reason.title} className="border-slate-200">
                <CardContent className="p-6">
                  <Icon className="h-5 w-5 text-amber-600" />
                  <h2 className="mt-4 text-lg font-semibold text-slate-900">
                    {reason.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {reason.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Card className="border-slate-200 bg-slate-50">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-amber-600" />
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Company information
                </p>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-slate-900">
                Built to earn trust with transparent, enterprise-ready
                operations
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {COMPANY_NAME} is committed to providing dependable SMS
                delivery, transparent campaign reporting, and practical support
                for businesses that need fast execution without technical
                friction.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white px-4 py-4">
                  <p className="text-sm text-slate-500">CIN</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {COMPANY_CIN}
                  </p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-4">
                  <p className="text-sm text-slate-500">Registration details</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    Official company registration details are maintained and
                    available for compliance review upon request.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
