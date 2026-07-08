import Link from "next/link";
import {
  COMPANY_ADDRESS,
  COMPANY_CIN,
  COMPANY_GST,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  COMPANY_NAME,
} from "@/lib/constants";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Features", href: "/features" },
  { label: "Contact Us", href: "/contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-lg font-semibold text-slate-900">{COMPANY_NAME}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Reliable bulk SMS infrastructure for marketers, startups, and
            enterprise teams that need fast delivery with compliance support.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Quick Links
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition hover:text-amber-600"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Company Details
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>
              Email:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-semibold text-slate-900 transition hover:text-amber-700"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>Phone: {CONTACT_PHONE}</li>
            <li>CIN: {COMPANY_CIN}</li>
            <li>GST: {COMPANY_GST}</li>
            <li>{COMPANY_ADDRESS}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()} {COMPANY_NAME}. SMS services are subject
          to telecom regulations, DLT compliance, and approved usage terms.
        </p>
      </div>
    </footer>
  );
}
