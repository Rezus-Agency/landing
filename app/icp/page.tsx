import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/effects/Reveal";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "ICP Tool",
  description:
    "Un outil gratuit pour définir votre client idéal et prioriser vos comptes cibles. Disponible dès maintenant.",
};

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
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

function ListCheckIcon() {
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
      <path d="M4 6h16M4 12h16M4 18h10" />
      <path d="M16 16l2 2 3-3" />
    </svg>
  );
}

function DownloadIcon() {
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
      <path d="M12 3v12M8 11l4 4 4-4" />
      <path d="M5 21h14" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: <TargetIcon />,
    title: "Définissez votre ICP",
    desc: "Quelques questions guidées, et vous obtenez un profil de client idéal clair : secteur, taille, signaux, déclencheurs.",
  },
  {
    icon: <ListCheckIcon />,
    title: "Scorez vos comptes",
    desc: "Importez une liste de comptes, l'outil les priorise selon leur adéquation avec votre ICP. Le bon ordre, tout de suite.",
  },
  {
    icon: <DownloadIcon />,
    title: "Exportez et agissez",
    desc: "Récupérez votre ICP et vos comptes priorisés, prêts à alimenter vos campagnes, les nôtres ou les vôtres.",
  },
];

export default function ICPLandingPage() {
  return (
    <>
      <Header />

      <main>
        {/* HERO */}
        <section className="phero">
          <div className="phero__bg" aria-hidden="true">
            <div className="hero__grid" />
          </div>
          <div className="wrap phero__inner">
            <Reveal as="span" className="badge-soon">
              <span className="dot" />
              Gratuit · Sans carte bancaire
            </Reveal>
            <Reveal as="div" delay={1}>
              <h1 style={{ marginTop: "var(--s-4)" }}>Votre ICP, défini en 5 minutes.</h1>
            </Reveal>
            <Reveal as="div" delay={2}>
              <p className="lede">
                Un outil gratuit pour cadrer votre client idéal, scorer vos comptes cibles, et
                arrêter de prospecter à l&apos;aveugle. Disponible dès maintenant.
              </p>
            </Reveal>
            <Reveal className="phero__cta" delay={3}>
              <Link href="/icp/tool/signup" className="btn btn--primary">
                Créer mon compte gratuit
                <ArrowRightIcon />
              </Link>
              <Link href="/icp/tool/login" className="btn btn--secondary">
                J&apos;ai déjà un compte
              </Link>
            </Reveal>
          </div>
        </section>

        {/* WHAT IT DOES */}
        <section className="section section--band">
          <div className="wrap">
            <Reveal className="shead">
              <span className="kicker">
                <span className="shead__index">01</span>Ce que fait l&apos;outil
              </span>
              <h2 className="h2">Du flou stratégique à une cible actionnable.</h2>
            </Reveal>

            <div className="feature-grid">
              {FEATURES.map((feature, i) => (
                <Reveal
                  key={feature.title}
                  as="article"
                  className="feature"
                  delay={i === 0 ? undefined : (i as 1 | 2)}
                >
                  <span className="feature__ic">{feature.icon}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </Reveal>
              ))}
            </div>

            <Reveal className="uimock">
              <div className="uimock__bar">
                <i />
                <i />
                <i />
              </div>
              <div className="uimock__body">
                <span>[ aperçu de l&apos;interface ICP Tool ]</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="section">
          <div className="wrap finalcta">
            <Reveal>
              <CursorGlow className="finalcta__box">
                <span
                  className="kicker kicker--plain"
                  style={{ justifyContent: "center", display: "flex" }}
                >
                  Prêt à clarifier votre cible ?
                </span>
                <h2 className="h2" style={{ marginTop: "var(--s-4)" }}>
                  Votre premier ICP, <span className="serif-accent">maintenant.</span>
                </h2>
                <p className="lede">
                  Créez un compte gratuit et obtenez un document ICP actionnable en moins de 15
                  minutes.
                </p>
                <div className="finalcta__cta">
                  <Link href="/icp/tool/signup" className="btn btn--primary">
                    Créer mon compte gratuit
                    <ArrowRightIcon />
                  </Link>
                  <Link href="/icp/tool/login" className="btn btn--secondary">
                    Se connecter
                  </Link>
                </div>
                <p className="finalcta__fine">
                  Gratuit · Sans carte bancaire ·{" "}
                  <Link
                    href="/contact"
                    style={{
                      color: "var(--text-2)",
                      borderBottom: "1px solid var(--border-strong)",
                    }}
                  >
                    Une question ?
                  </Link>
                </p>
              </CursorGlow>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
