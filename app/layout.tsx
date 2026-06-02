import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono, Newsreader } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
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
  metadataBase: new URL("https://rezus-agency.com"),
  title: {
    default: "Rezus Agency — Outbound qui n'a rien à voir avec du spam",
    template: "%s · Rezus Agency",
  },
  description:
    "Agence d'outbound B2B pour les fondateurs et dirigeants de boîtes tech francophones. Du ciblage précis, pas du volume.",
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
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
