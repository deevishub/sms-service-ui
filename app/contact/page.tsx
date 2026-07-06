import type { Metadata } from "next";
import { Mail, MapPin, PhoneCall } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import {
  COMPANY_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  COMPANY_NAME,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: `Contact ${COMPANY_NAME}`,
  description:
    "Get in touch with Deevishub for enterprise DLT SMS support, messaging onboarding, and campaign execution guidance.",
  keywords: [
    "contact Deevishub",
    "DLT SMS support",
    "enterprise SMS sales",
    "SMS onboarding",
    "messaging support",
  ],
  openGraph: {
    title: `Contact ${COMPANY_NAME}`,
    description:
      "Get in touch with Deevishub for enterprise DLT SMS support, messaging onboarding, and campaign execution guidance.",
    url: "https://sms.deevishub.com/contact",
  },
};

const details = [
  {
    label: "Email",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    icon: Mail,
  },
  {
    label: "Phone",
    value: CONTACT_PHONE,
    icon: PhoneCall,
  },
  {
    label: "Address",
    value: COMPANY_ADDRESS,
    icon: MapPin,
  },
];

export default function ContactPage() {
  return (
    <div className="bg-white">
      <section className="px-4 pb-10 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            Contact {COMPANY_NAME}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Talk to the team that helps brands send with confidence.
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Share your business goals, messaging volume, and timeline. We’ll
            follow up with a tailored plan, pricing guidance, and implementation
            support.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-slate-200">
            <CardContent className="p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
                Contact details
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                Reach the Deevishub sales and support team
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Whether you need help evaluating plans or want to discuss a
                rollout, our team is ready to help you build a reliable campaign
                strategy.
              </p>

              <div className="mt-6 space-y-4">
                {details.map((detail) => {
                  const Icon = detail.icon;

                  return (
                    <div
                      key={detail.label}
                      className="rounded-2xl bg-slate-50 px-4 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-amber-600" />
                        <p className="text-sm font-semibold text-slate-900">
                          {detail.label}
                        </p>
                      </div>
                      {detail.href ? (
                        <a
                          href={detail.href}
                          className="mt-2 block text-sm text-slate-700 transition hover:text-amber-700"
                        >
                          {detail.value}
                        </a>
                      ) : (
                        <p className="mt-2 text-sm text-slate-700">
                          {detail.value}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4 text-sm text-slate-700">
                Typical response time: within 30 minutes during business hours.
              </div>
            </CardContent>
          </Card>

          <ContactForm />
        </div>
      </section>
    </div>
  );
}
