import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/effects/Reveal";
import { ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Page introuvable",
  description: "Cette page n'existe pas ou a été déplacée. Retour à l'accueil de Rezus Agency.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Header />

      <main id="main" tabIndex={-1}>
        <section className="phero" style={{ paddingBottom: "clamp(64px, 8vw, 120px)" }}>
          <div className="phero__bg" aria-hidden="true">
            <div className="hero__grid" />
          </div>
          <div className="wrap phero__inner" style={{ maxWidth: "var(--maxw)" }}>
            <Reveal as="span">
              <span className="kicker">
                <span className="shead__index">404</span>
                Page introuvable
              </span>
            </Reveal>

            <Reveal as="div" delay={1}>
              <h1 style={{ marginTop: "var(--s-5)", maxWidth: "20ch" }}>
                Cette page n&apos;existe pas.
              </h1>
            </Reveal>

            <Reveal as="div" delay={2}>
              <p className="lede" style={{ maxWidth: "56ch" }}>
                Lien obsolète, faute de frappe dans l&apos;URL, ou page déplacée. Voici par où
                continuer.
              </p>
            </Reveal>

            <Reveal
              as="div"
              delay={3}
              className="hero__cta"
              style={{ gap: "var(--s-5)", marginTop: "var(--s-7)" } as React.CSSProperties}
            >
              <Link href="/" className="btn btn--primary">
                Retour à l&apos;accueil
                <ArrowRightIcon />
              </Link>
              <Link href="/methode" className="btn btn--ghost" style={{ color: "var(--text-3)" }}>
                Voir la méthode
              </Link>
            </Reveal>

            <Reveal as="div" delay={3} style={{ marginTop: "var(--s-8)" }}>
              <p
                style={{
                  color: "var(--text-3)",
                  fontSize: "13px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-mono)",
                  marginBottom: "var(--s-4)",
                }}
              >
                Pages utiles
              </p>
              <ul
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--s-3) var(--s-5)",
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                <li>
                  <Link
                    href="/methode"
                    style={{
                      color: "var(--text-2)",
                      borderBottom: "1px solid var(--border-strong)",
                      paddingBottom: "2px",
                    }}
                  >
                    La méthode
                  </Link>
                </li>
                <li>
                  <Link
                    href="/icp"
                    style={{
                      color: "var(--text-2)",
                      borderBottom: "1px solid var(--border-strong)",
                      paddingBottom: "2px",
                    }}
                  >
                    Outil ICP
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    style={{
                      color: "var(--text-2)",
                      borderBottom: "1px solid var(--border-strong)",
                      paddingBottom: "2px",
                    }}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
