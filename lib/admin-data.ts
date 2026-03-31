export type AccountStatus = "active" | "suspended" | "review";
export type DltMessageType = "transactional" | "promotional" | "service-explicit";
export type QueueHealth = "healthy" | "warning" | "critical";

export interface AdminAccount {
  id: string;
  company: string;
  email: string;
  plan: "starter" | "growth" | "business" | "enterprise";
  status: AccountStatus;
  messagesThisMonth: number;
  walletBalance: number;
  joinedAt: string;
}

export interface DltSubmission {
  id: string;
  company: string;
  senderId: string;
  templateName: string;
  messageType: DltMessageType;
  submittedAt: string;
  riskFlags: string[];
}

export interface ProviderMetric {
  name: string;
  status: "healthy" | "degraded" | "down";
  latencyMs: number;
  errorRatePct: number;
  throughputMps: number;
  uptimePct: number;
  costPerSmsInr: number;
}

export interface QueueMetric {
  name: string;
  lag: number;
  throughputPerSecond: number;
  status: QueueHealth;
}

export const adminAccounts: AdminAccount[] = [
  {
    id: "acc_001",
    company: "TechStarUp Inc",
    email: "admin@techstartup.com",
    plan: "growth",
    status: "active",
    messagesThisMonth: 450000,
    walletBalance: 76120,
    joinedAt: "2026-01-15",
  },
  {
    id: "acc_002",
    company: "E-Mart Solutions",
    email: "billing@emart.com",
    plan: "business",
    status: "active",
    messagesThisMonth: 1200000,
    walletBalance: 11850,
    joinedAt: "2026-02-20",
  },
  {
    id: "acc_003",
    company: "FinFleet Capital",
    email: "ops@finfleet.in",
    plan: "enterprise",
    status: "review",
    messagesThisMonth: 2940000,
    walletBalance: 218900,
    joinedAt: "2025-11-04",
  },
  {
    id: "acc_004",
    company: "Offline Retail Co",
    email: "contact@offline.com",
    plan: "starter",
    status: "suspended",
    messagesThisMonth: 0,
    walletBalance: 530,
    joinedAt: "2026-03-10",
  },
];

export const dltSubmissions: DltSubmission[] = [
  {
    id: "dlt_901",
    company: "TechStarUp Inc",
    senderId: "TD-TSUPDT",
    templateName: "OTP Verification v2",
    messageType: "transactional",
    submittedAt: "2026-03-29 09:42",
    riskFlags: [],
  },
  {
    id: "dlt_902",
    company: "E-Mart Solutions",
    senderId: "TP-EMSALE",
    templateName: "Weekend Offer 20 Percent",
    messageType: "promotional",
    submittedAt: "2026-03-29 10:15",
    riskFlags: ["consent_missing", "outside_timing_window"],
  },
  {
    id: "dlt_903",
    company: "FinFleet Capital",
    senderId: "SE-FFALRT",
    templateName: "Statement Ready Notice",
    messageType: "service-explicit",
    submittedAt: "2026-03-29 11:01",
    riskFlags: ["consent_sample_required"],
  },
];

export const providerMetrics: ProviderMetric[] = [
  {
    name: "MSG91",
    status: "healthy",
    latencyMs: 124,
    errorRatePct: 0.8,
    throughputMps: 8600,
    uptimePct: 99.97,
    costPerSmsInr: 0.12,
  },
  {
    name: "Gupshup",
    status: "healthy",
    latencyMs: 152,
    errorRatePct: 1.9,
    throughputMps: 3400,
    uptimePct: 99.95,
    costPerSmsInr: 0.14,
  },
  {
    name: "Twilio",
    status: "degraded",
    latencyMs: 448,
    errorRatePct: 6.2,
    throughputMps: 900,
    uptimePct: 99.7,
    costPerSmsInr: 0.2,
  },
];

export const queueMetrics: QueueMetric[] = [
  {
    name: "sms.outbound.high",
    lag: 120,
    throughputPerSecond: 5100,
    status: "healthy",
  },
  {
    name: "sms.outbound.normal",
    lag: 980,
    throughputPerSecond: 2800,
    status: "warning",
  },
  {
    name: "sms.outbound.bulk",
    lag: 5420,
    throughputPerSecond: 1500,
    status: "critical",
  },
  {
    name: "sms.dlr",
    lag: 340,
    throughputPerSecond: 4200,
    status: "healthy",
  },
];

export const pricingPlans = [
  { plan: "starter", baseRate: 0.21, markupPct: 26, freeMessages: 0 },
  { plan: "growth", baseRate: 0.18, markupPct: 21, freeMessages: 1000 },
  { plan: "business", baseRate: 0.16, markupPct: 18, freeMessages: 5000 },
  { plan: "enterprise", baseRate: 0.14, markupPct: 14, freeMessages: 20000 },
];

export const accountOverrides = [
  {
    account: "FinFleet Capital",
    plan: "enterprise",
    route: "premium_txn",
    customRate: 0.13,
    marginPct: 9.8,
  },
  {
    account: "E-Mart Solutions",
    plan: "business",
    route: "promo_bulk",
    customRate: 0.15,
    marginPct: 6.4,
  },
];

export const monthlyFinancialSummary = {
  grossRevenueInr: 4200000,
  providerCostInr: 3152000,
  grossMarginPct: 24.95,
  creditsOutstandingInr: 287000,
  refundsInr: 38200,
};

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatCurrencyInr(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}
