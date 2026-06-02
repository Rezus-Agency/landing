import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono, Newsreader } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { JsonLd } from "@/components/seo/JsonLd";
import { Plausible } from "@/components/seo/Plausible";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { organizationSchema, websiteSchema } from "@/lib/json-ld";
import { SITE, GSC_VERIFICATION, ogImageUrl } from "@/lib/seo";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Rezus Agency · Agence cold email B2B pour fondateurs tech",
    template: "%s · Rezus Agency",
  },
  description:
    "Agence cold email B2B pour fondateurs tech francophones. 100 à 200 comptes ciblés par campagne, pas 10 000 emails. Multi-domaines, warmup, sans engagement.",
  keywords: [
    "agence cold email B2B",
    "agence cold email France",
    "agence outbound B2B",
    "outbound B2B France",
    "agence prospection B2B",
    "cold email SaaS",
    "agence cold email fondateurs",
    "outbound pour fondateurs tech",
    "ICP B2B",
    "deliverability cold email",
  ],
  authors: [{ name: SITE.founderName }],
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: { "fr-FR": "/" },
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: "Rezus Agency · Agence cold email B2B pour fondateurs tech",
    description:
      "Agence cold email B2B pour fondateurs tech francophones. Du ciblage chirurgical, des comptes nommés, sans grilling de domaines.",
    images: [
      {
        url: ogImageUrl(SITE.tagline, "Agence outbound B2B · France"),
        width: 1200,
        height: 630,
        alt: SITE.tagline,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitterHandle,
    creator: SITE.twitterHandle,
    title: "Rezus Agency · Agence cold email B2B pour fondateurs tech",
    description:
      "Agence cold email B2B pour fondateurs tech francophones. Du ciblage chirurgical, pas du volume.",
    images: [ogImageUrl(SITE.tagline, "Agence outbound B2B · France")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "business",
  verification: {
    google: GSC_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      data-theme="dark"
      data-headline="grotesque"
      data-hero="centered"
      data-compare="editorial"
      className={`${hankenGrotesk.variable} ${jetbrainsMono.variable} ${newsreader.variable}`}
    >
      <head>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
      </head>
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
        <div className="grain" aria-hidden="true" />
        <Plausible />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
