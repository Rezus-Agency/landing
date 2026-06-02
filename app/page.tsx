import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        <section className="hero">
          <div className="hero__bg" aria-hidden="true">
            <div className="hero__grid" />
            <div className="hero__glow" />
          </div>
          <Container as="div" className="hero__inner">
            <span className="hero__tag" data-anim>
              <span className="dot" />
              Outbound B2B · France
            </span>

            <div className="hero__h1mask">
              <h1 className="h-display" data-anim style={{ "--d": "0.05s" } as React.CSSProperties}>
                Outbound qui n&apos;a{" "}
                <span className="hero__strike">
                  rien à voir
                  <svg
                    className="hero__brush"
                    viewBox="0 0 320 24"
                    aria-hidden="true"
                    preserveAspectRatio="none"
                  >
                    <path d="M4 14 Q 60 4, 130 12 T 250 10 T 316 14" />
                    <path
                      className="hero__brush--wisp"
                      d="M10 16 Q 70 8, 140 14 T 252 12 T 312 16"
                    />
                  </svg>
                </span>{" "}
                avec du spam.
              </h1>
            </div>

            <p
              className="hero__sub lede"
              data-anim
              style={{ "--d": "0.3s" } as React.CSSProperties}
            >
              Pour fondateurs et dirigeants B2B francophones qui veulent un canal d&apos;acquisition
              fiable. Construit sur des comptes nommés, vérifié fait par fait, piloté chaque
              semaine.
            </p>

            <div className="hero__cta" data-anim style={{ "--d": "0.42s" } as React.CSSProperties}>
              <Link href="#comparaison" className="btn btn--primary">
                Voir la méthode
              </Link>
              <Link href="/icp" className="btn btn--secondary">
                Définir mon ICP gratuitement
              </Link>
            </div>
          </Container>
        </section>

        <section className="section">
          <Container>
            <div className="shead">
              <span className="kicker">
                <span className="shead__index">02</span> Reconnaissance du pain
              </span>
              <h2 className="h2">Trois constats sans complaisance.</h2>
            </div>
            <div className="pains" style={{ marginTop: "var(--s-7)" }}>
              <div className="pain">
                <span className="pain__num">01</span>
                <p>
                  Vous avez déjà <b>tenté une agence outbound</b>. Le démarrage était soigné, la
                  suite, beaucoup moins.
                </p>
                <span className="pain__hint">Et la facture, elle, n&apos;a pas baissé.</span>
              </div>
              <div className="pain">
                <span className="pain__num">02</span>
                <p>
                  Vous avez monté un <b>outil en interne</b> (Lemlist, Smartlead) qui a fini par
                  griller vos domaines.
                </p>
                <span className="pain__hint">Six mois plus tard, vous repartez de zéro.</span>
              </div>
              <div className="pain">
                <span className="pain__num">03</span>
                <p>
                  Vous repoussez l&apos;outbound depuis des mois, de peur de devenir{" "}
                  <b>une boîte de spam</b>.
                </p>
                <span className="pain__hint">Pourtant le bouche-à-oreille plafonne.</span>
              </div>
            </div>
          </Container>
        </section>

        <section className="section section--band" id="comparaison">
          <Container>
            <div className="shead">
              <span className="kicker">
                <span className="shead__index">03</span> La méthode en 10 points
              </span>
              <h2 className="h2">Ancien monde de l&apos;outbound. Et la nôtre.</h2>
              <p className="shead__lede lede">
                Là où la plupart envoient en masse à l&apos;aveugle, on construit un signal par
                signal, fait par fait, compte par compte.
              </p>
            </div>

            <div className="cmp">
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  color: "var(--text-3)",
                  letterSpacing: "0.06em",
                }}
              >
                [Placeholder Étape 2 · Les 10 axes complets et leurs sources arrivent à l&apos;Étape
                B.1 (Homepage).]
              </p>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
