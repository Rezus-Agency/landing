import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/effects/Reveal";
import { ContactForm } from "@/components/effects/ContactForm";
import { CalendlyInline } from "@/components/effects/CalendlyInline";
import { JsonLd } from "@/components/seo/JsonLd";
import { CheckIcon } from "@/components/icons";
import { ogImageUrl } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/json-ld";

const PAGE_TITLE = "Voyons si on est les bons";
const PAGE_DESC =
  "Un appel de 30 minutes, sans engagement. On regarde votre marché et vos comptes cibles, et on vous dit si l'outbound a du sens pour vous. Pas de pitch.";

export const metadata: Metadata = {
  title: "Contact",
  description: PAGE_DESC,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: "/contact",
    images: [
      { url: ogImageUrl(PAGE_TITLE, "Contact · 30 min sans engagement"), width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [ogImageUrl(PAGE_TITLE, "Contact · 30 min sans engagement")],
  },
};

function BreadcrumbIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <Header />

      <main id="main" tabIndex={-1}>
        {/* HERO */}
        <section className="phero" style={{ paddingBottom: "clamp(40px, 5vw, 64px)" }}>
          <div className="phero__bg" aria-hidden="true">
            <div className="hero__grid" />
          </div>
          <div className="wrap phero__inner" style={{ maxWidth: "var(--maxw)" }}>
            <Reveal as="span">
              <Link href="/" className="breadcrumb">
                <BreadcrumbIcon />
                Accueil
              </Link>
            </Reveal>
            <Reveal as="div" delay={1}>
              <h1 style={{ marginTop: "var(--s-5)", maxWidth: "20ch" }}>
                Voyons si on est les bons.
              </h1>
            </Reveal>
            <Reveal as="div" delay={2}>
              <p className="lede" style={{ maxWidth: "56ch" }}>
                Un appel de 30 minutes, sans engagement. On regarde votre marché et vos comptes
                cibles, et on vous dit si l&apos;outbound a du sens pour vous. Pas de pitch.
              </p>
            </Reveal>
          </div>
        </section>

        {/* CONTACT GRID */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap contact-grid">
            {/* À quoi s'attendre */}
            <Reveal>
              <h2 className="kicker" style={{ margin: 0 }}>
                <span className="shead__index">01</span>À quoi s&apos;attendre
              </h2>
              <div className="expect" style={{ marginTop: "var(--s-6)" }}>
                <div className="expect__item">
                  <span className="expect__ic" aria-hidden="true">
                    <ClockIcon />
                  </span>
                  <div>
                    <h3>30 minutes, pas plus</h3>
                    <p>On respecte votre temps. Pas de slides, pas de discovery déguisée.</p>
                  </div>
                </div>
                <div className="expect__item">
                  <span className="expect__ic" aria-hidden="true">
                    <TargetIcon />
                  </span>
                  <div>
                    <h3>On regarde votre marché</h3>
                    <p>
                      Vos comptes cibles, votre cycle de vente, votre positionnement. Du concret,
                      pas du générique.
                    </p>
                  </div>
                </div>
                <div className="expect__item">
                  <span className="expect__ic" aria-hidden="true">
                    <CheckIcon />
                  </span>
                  <div>
                    <h3>Oui, non, ou pas encore</h3>
                    <p>
                      Si l&apos;outbound n&apos;a pas de sens pour vous, on vous le dit. Si
                      c&apos;est trop tôt, aussi.
                    </p>
                  </div>
                </div>
              </div>
              <p
                style={{
                  marginTop: "var(--s-7)",
                  color: "var(--text-2)",
                  fontSize: "14.5px",
                }}
              >
                Vous préférez écrire ?{" "}
                <a
                  href="mailto:contact@rezus-agency.com"
                  style={{
                    color: "var(--text)",
                    borderBottom: "1px solid var(--border-strong)",
                  }}
                >
                  contact@rezus-agency.com
                </a>
              </p>
            </Reveal>

            {/* Form */}
            <Reveal delay={1}>
              <ContactForm />
            </Reveal>
          </div>
        </section>

        {/* CALENDLY */}
        <section className="section section--band">
          <div className="wrap">
            <Reveal className="shead shead--center">
              <span className="kicker kicker--plain">Ou réservez directement</span>
              <h2 className="h2">Réservez 30 minutes.</h2>
              <p className="shead__lede">Pas envie d&apos;écrire ? Le calendrier est ouvert.</p>
            </Reveal>
            <Reveal style={{ marginTop: "clamp(40px, 5vw, 64px)" } as React.CSSProperties}>
              <CalendlyInline />
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
