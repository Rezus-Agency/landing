import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/effects/Reveal";
import { ContactForm } from "@/components/effects/ContactForm";
import { CheckIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Réservez un appel de 30 minutes. On regarde votre cible et on vous dit honnêtement si l'outbound a du sens pour vous.",
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
      <Header />

      <main>
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
                Parlons de votre pipeline.
              </h1>
            </Reveal>
            <Reveal as="div" delay={2}>
              <p className="lede" style={{ maxWidth: "56ch" }}>
                Un appel de 30 minutes, sans engagement. On regarde votre cible et on vous dit
                honnêtement si l&apos;outbound a du sens pour vous.
              </p>
            </Reveal>
          </div>
        </section>

        {/* CONTACT GRID */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap contact-grid">
            {/* À quoi s'attendre */}
            <Reveal>
              <span className="kicker">
                <span className="shead__index">01</span>À quoi s&apos;attendre
              </span>
              <div className="expect" style={{ marginTop: "var(--s-6)" }}>
                <div className="expect__item">
                  <span className="expect__ic">
                    <ClockIcon />
                  </span>
                  <div>
                    <h4>30 minutes, pas plus</h4>
                    <p>
                      On respecte votre temps. Pas de présentation de 40 slides, droit au sujet.
                    </p>
                  </div>
                </div>
                <div className="expect__item">
                  <span className="expect__ic">
                    <TargetIcon />
                  </span>
                  <div>
                    <h4>On regarde votre cible</h4>
                    <p>
                      Marché, comptes idéaux, angle d&apos;entrée. Du concret, calibré sur votre
                      situation.
                    </p>
                  </div>
                </div>
                <div className="expect__item">
                  <span className="expect__ic">
                    <CheckIcon />
                  </span>
                  <div>
                    <h4>Une réponse honnête</h4>
                    <p>
                      Si l&apos;outbound n&apos;a pas de sens pour vous maintenant, on vous le dira.
                      On ne force rien.
                    </p>
                  </div>
                </div>
              </div>
              <p
                style={{
                  marginTop: "var(--s-7)",
                  color: "var(--text-3)",
                  fontSize: "14.5px",
                }}
              >
                Vous préférez écrire ?{" "}
                <a
                  href="mailto:hello@rezus.agency"
                  style={{
                    color: "var(--text-2)",
                    borderBottom: "1px solid var(--border-strong)",
                  }}
                >
                  hello@rezus.agency
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
              <h2 className="h2">Choisissez un créneau.</h2>
              <p className="shead__lede">
                Pas envie de remplir un formulaire ? Réservez en deux clics.
              </p>
            </Reveal>
            <Reveal className="calendly">
              <p className="calendly__label">
                <b>Calendly</b>
                Intégrez ici votre lien Calendly (widget inline). Remplacez ce bloc par le script
                d&apos;embed officiel pour afficher le calendrier de réservation.
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
