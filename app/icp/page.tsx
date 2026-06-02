import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/effects/Reveal";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowRightIcon } from "@/components/icons";
import { ogImageUrl } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/json-ld";

const PAGE_TITLE = "Votre ICP, cadré en 15 minutes";
const PAGE_DESC =
  "Un outil gratuit qui vous force à clarifier qui sont vraiment vos clients idéaux. Et qui transforme cette clarté en comptes cibles prêts à contacter.";

export const metadata: Metadata = {
  title: "ICP Tool",
  description: PAGE_DESC,
  keywords: [
    "ICP B2B",
    "définition ICP",
    "ICP SaaS",
    "outil ICP gratuit",
    "profil client idéal B2B",
  ],
  alternates: { canonical: "/icp" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: "/icp",
    images: [{ url: ogImageUrl(PAGE_TITLE, "ICP Tool · Gratuit"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [ogImageUrl(PAGE_TITLE, "ICP Tool · Gratuit")],
  },
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
    title: "Cadrez votre ICP",
    desc: "Une quinzaine de questions guidées. Vous obtenez un profil clair : secteur, taille, signaux d'achat, déclencheurs.",
  },
  {
    icon: <ListCheckIcon />,
    title: "Scorez vos comptes",
    desc: "Importez votre liste de comptes. L'outil les classe selon leur fit avec votre ICP. Vos commerciaux savent par où commencer.",
  },
  {
    icon: <DownloadIcon />,
    title: "Exportez et agissez",
    desc: "Téléchargez votre document ICP et la liste priorisée. Prêts à lancer vos campagnes, les nôtres ou les vôtres.",
  },
];

export default function ICPLandingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", path: "/" },
          { name: "ICP Tool", path: "/icp" },
        ])}
      />
      <Header />

      <main id="main" tabIndex={-1}>
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
              <h1 style={{ marginTop: "var(--s-4)" }}>Votre ICP, cadré en 15 minutes.</h1>
            </Reveal>
            <Reveal as="div" delay={2}>
              <p className="lede">
                Un outil gratuit qui vous force à clarifier qui sont vraiment vos clients idéaux. Et
                qui transforme cette clarté en comptes cibles prêts à contacter.
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
              <h2 className="h2">De l&apos;intuition à une cible documentée.</h2>
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
                  Prochaine étape
                </span>
                <h2 className="h2" style={{ marginTop: "var(--s-4)" }}>
                  Votre premier ICP, <span className="serif-accent">maintenant.</span>
                </h2>
                <p className="lede">
                  Créez un compte gratuit. En 15 minutes, vous avez un document ICP que vos
                  commerciaux peuvent utiliser.
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
