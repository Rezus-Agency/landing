export type Source = {
  id: string;
  name: string;
  url: string;
  year: number;
};

export const SOURCES: Record<string, Source> = {
  instantly2026: {
    id: "instantly2026",
    name: "Instantly Benchmark Report",
    url: "https://instantly.ai/cold-email-benchmark-report-2026",
    year: 2026,
  },
  orrjo2026: {
    id: "orrjo2026",
    name: "ORRJO State of B2B Outbound",
    url: "https://orrjo.com/research/state-of-b2b-outbound-2026",
    year: 2026,
  },
  leadriver2026: {
    id: "leadriver2026",
    name: "LeadRiver State of B2B Outbound",
    url: "https://www.leadriver.io/blog/state-of-b2b-outbound-2026",
    year: 2026,
  },
  validity2026: {
    id: "validity2026",
    name: "Validity Email Deliverability Benchmark",
    url: "https://www.validity.com/resource-center/2026-email-deliverability-benchmark-report/",
    year: 2026,
  },
  digitalApplied2026: {
    id: "digitalApplied2026",
    name: "Digital Applied AI SDR Statistics",
    url: "https://www.digitalapplied.com/blog/ai-sdr-statistics-2026-outbound-sales-data-points",
    year: 2026,
  },
  martal: {
    id: "martal",
    name: "Martal Group B2B Cold Email Statistics",
    url: "https://martal.ca/b2b-cold-email-statistics-lb/",
    year: 2026,
  },
  backlinko: {
    id: "backlinko",
    name: "Backlinko 12M Email Study",
    url: "https://backlinko.com/email-outreach-study",
    year: 2025,
  },
  lead411_2026: {
    id: "lead411_2026",
    name: "Lead411 Targeting Analysis",
    url: "https://www.lead411.com/blog/why-most-b2b-companies-are-targeting-the-wrong-accounts-in-2026/",
    year: 2026,
  },
  ehrenbergBass: {
    id: "ehrenbergBass",
    name: "Ehrenberg-Bass Institute (95:5 rule)",
    url: "https://marketingscience.info/news-and-insights/the-955-rule-why-b2b-growth-starts-long-before-the-purchase",
    year: 2024,
  },
} as const;

export type SourceId = keyof typeof SOURCES;
