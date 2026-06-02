import { SITE, absoluteUrl } from "@/lib/seo";
import { HOMEPAGE_FAQ } from "@/lib/faq-items";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE.url}#organization`,
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/logo.svg`,
  description: SITE.shortDescription,
  email: SITE.email,
  founder: {
    "@type": "Person",
    name: SITE.founderName,
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "FR",
  },
  sameAs: ["https://www.linkedin.com/company/rezus-agency"],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}#website`,
  url: SITE.url,
  name: SITE.name,
  description: SITE.shortDescription,
  inLanguage: SITE.language,
  publisher: {
    "@id": `${SITE.url}#organization`,
  },
};

export const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOMEPAGE_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function professionalServiceSchema(opts: {
  url: string;
  name: string;
  description: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType,
    url: opts.url,
    provider: { "@id": `${SITE.url}#organization` },
    areaServed: { "@type": "Country", name: "France" },
  };
}
