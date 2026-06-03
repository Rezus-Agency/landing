import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/effects/Reveal";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { FAQAccordion } from "@/components/effects/FAQAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowRightIcon } from "@/components/icons";
import { ogImageUrl } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/json-ld";

const PAGE_TITLE = "ICP Tool";
const PAGE_DESC =
  "Un outil qui challenge votre intuition au lieu de la valider. Recherche en direct, analyse stratégique complète du marché, outputs prêts à exécuter.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  keywords: [
    "ICP B2B",
    "ICP discovery",
    "définition ICP",
    "ICP SaaS",
    "outil ICP B2B",
    "profil client idéal B2B",
    "cadrage ICP stratégique",
  ],
  alternates: { canonical: "/icp" },
  openGraph: {
    title: "ICP discovery, pas ICP validation",
    description: PAGE_DESC,
    url: "/icp",
    images: [{ url: ogImageUrl("ICP discovery", "Pas ICP validation"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ICP discovery, pas ICP validation",
    description: PAGE_DESC,
    images: [ogImageUrl("ICP discovery", "Pas ICP validation")],
  },
};

const DIAGNOSTIC = [
  {
    tag: "L'INTUITION",
    body: (
      <>
        Un Notion rempli un dimanche soir, partagé en Slack, oublié au bout d&apos;un mois. La cible
        est ce que vous <em>pensez</em>{" "}qu&apos;elle est. Pas ce qu&apos;elle est vraiment.
      </>
    ),
  },
  {
    tag: "LE CONSULTANT",
    body: (
      <>
        Une journée d&apos;atelier à 4 000 €, un PDF de 30 pages, des slides génériques. Rien qui
        résiste à votre première campagne réelle.
      </>
    ),
  },
  {
    tag: "LE TEMPLATE LINKEDIN",
    body: (
      <>
        12 cases à remplir copiées sur un post viral. Aucune analyse de marché, aucun filtre
        exécutable, aucun angle d&apos;attaque.
      </>
    ),
  },
];

const DIFFERENTIATORS = [
  {
    num: "01",
    title: "Il challenge, il ne valide pas",
    desc: "Vous arrivez avec une intuition (« je vise les CAC 40 »). L'outil ne dit pas oui. Il fait remonter le cycle de vente moyen de 14 mois, votre runway, votre capacité commerciale, et vous fait choisir en conscience. Si vous voulez être flatté, allez ailleurs.",
    hint: "Discovery, pas validation",
  },
  {
    num: "02",
    title: "Il fait ses recherches en direct",
    desc: "Pendant la conversation, l'outil va chercher la taille du marché, vos concurrents, les tendances récentes, les études pertinentes. Vous voyez les sources s'afficher. Vous ne lisez pas du texte généré, vous lisez une synthèse construite sur des sources réelles.",
    hint: "Sources visibles, pas du texte généré",
  },
  {
    num: "03",
    title: "Il livre une analyse de marché, pas une fiche ICP",
    desc: "À la fin, vous repartez avec l'écosystème dans lequel votre ICP vit : taille du segment, maturité, cycle de vente, budget moyen, psychologie du décideur, ses 3 challenges réels, votre angle compétitif.",
    hint: "L'écosystème, pas juste la cible",
  },
  {
    num: "04",
    title: "Il donne des outputs prêts à exécuter",
    desc: "Pas de templates d'email vides (sans connaître la personne, ils sonnent faux). Mais des filtres Sales Navigator à copier-coller, des filtres Clay au format JSON, vos critères de qualification, et vos hook angles par segment.",
    hint: "Du stratégique exécutable, pas un PDF",
  },
];

const ARTIFACTS = [
  {
    label: "ANALYSE MARCHÉ",
    desc: "Taille du segment, maturité, cycle de vente moyen, budget moyen.",
  },
  {
    label: "PSYCHOLOGIE DU DÉCIDEUR",
    desc: "Qui décide, comment, ses 3 challenges réels, ce qui le bloque.",
  },
  {
    label: "VOTRE ANGLE COMPÉTITIF",
    desc: "Sur quoi vous gagnez vs les concurrents identifiés.",
  },
  {
    label: "FILTRES SALES NAVIGATOR",
    desc: "Prêts à copier-coller dans LinkedIn.",
  },
  {
    label: "FILTRES CLAY",
    desc: "Au format JSON, importables en un clic.",
  },
  {
    label: "LIEN PUBLIC PARTAGEABLE",
    desc: "Pour votre équipe, votre board, votre conseil. Aucun compte requis pour lire.",
  },
];

const ICP_FAQ = [
  {
    q: "C'est un autre outil « AI-powered » générique ?",
    a: "Non. L'outil ne génère pas de texte à votre place. Il pose des questions difficiles, va chercher des sources réelles pendant la conversation, et vous force à prendre des décisions stratégiques. L'IA fait la recherche, vous faites les choix.",
  },
  {
    q: "Combien de temps prend la session ?",
    a: "15 à 30 minutes selon la profondeur de vos réponses. Ce n'est pas un wizard de 2 minutes. Une vraie session stratégique demande de vraies réponses. Si vous voulez expédier en 5 minutes, vous serez frustré.",
  },
  {
    q: "Pour qui ce n'est pas ?",
    a: "Si vous voulez un PDF générique que personne ne lira, prenez un template gratuit. Si vous voulez qu'un consultant valide votre intuition, prenez un consultant. L'outil est pour ceux qui veulent clarifier leur cible en conscience, pas pour ceux qui veulent être rassurés.",
  },
  {
    q: "Mes données sont-elles utilisées pour entraîner un modèle ?",
    a: "Non. Vos sessions sont privées. Vous pouvez supprimer votre compte et toutes vos données à tout moment. Le lien public partageable est généré uniquement si vous le demandez explicitement.",
  },
  {
    q: "Pourquoi c'est gratuit ? Quel est le piège ?",
    a: "Pas de piège. L'outil est aussi notre meilleur moyen de qualifier les agences B2B avec qui on travaille. Si vous voulez ensuite externaliser votre outbound, on est là. Sinon, vous repartez avec votre ICP, sans engagement.",
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
        {/* ===================== HERO ===================== */}
        <section className="phero">
          <div className="phero__bg" aria-hidden="true">
            <div className="hero__grid" />
          </div>
          <div className="wrap phero__inner">
            <Reveal as="span">
              <span className="kicker">
                <span className="shead__index">00</span>L&apos;outil
              </span>
            </Reveal>
            <Reveal as="div" delay={1}>
              <h1 style={{ marginTop: "var(--s-5)", maxWidth: "22ch" }}>
                La plupart des ICP sont écrits pour rassurer le fondateur. Pas pour gagner.
              </h1>
            </Reveal>
            <Reveal as="div" delay={2}>
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: "clamp(20px, 2.2vw, 26px)",
                  color: "var(--accent)",
                  marginTop: "var(--s-5)",
                  letterSpacing: "-0.01em",
                }}
              >
                ICP discovery. Pas ICP validation.
              </p>
            </Reveal>
            <Reveal as="div" delay={2}>
              <p className="lede" style={{ maxWidth: "58ch" }}>
                Un outil qui challenge votre intuition au lieu de la valider. Il fait ses
                recherches en direct, livre une analyse stratégique complète du marché que vous
                prétendez cibler, et vous repart avec des outputs prêts à exécuter.
              </p>
            </Reveal>
            <Reveal className="phero__cta" delay={3} style={{ gap: "var(--s-5)" }}>
              <Link href="/signup" className="btn btn--primary">
                Commencer une session
                <ArrowRightIcon />
              </Link>
              <Link
                href="/login"
                className="btn btn--ghost"
                style={{ color: "var(--text-3)" }}
              >
                J&apos;ai déjà un compte
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ===================== DIAGNOSTIC ===================== */}
        <section className="section section--tight section--band">
          <div className="wrap">
            <Reveal className="shead" style={{ marginBottom: "var(--s-7)" }}>
              <span className="kicker">
                <span className="shead__index">01</span>Le diagnostic
              </span>
              <h2 className="h2">Pourquoi votre ICP actuel ne marche pas.</h2>
              <p className="shead__lede">
                Trois façons courantes de définir son ICP. Trois façons d&apos;arriver à un
                document qui ne sert à rien.
              </p>
            </Reveal>
            <div className="pains">
              {DIAGNOSTIC.map((item, i) => (
                <Reveal
                  key={item.tag}
                  as="article"
                  className="pain"
                  delay={i === 0 ? undefined : (i as 1 | 2)}
                >
                  <span className="pain__num">{item.tag}</span>
                  <p>{item.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== APPROACH (4 differentiators) ===================== */}
        <section className="section">
          <div className="wrap">
            <Reveal className="shead" style={{ marginBottom: "var(--s-7)" }}>
              <span className="kicker">
                <span className="shead__index">02</span>L&apos;approche
              </span>
              <h2 className="h2">Un consultant stratégique, compressé en outil.</h2>
              <p className="shead__lede">
                Quatre choses que l&apos;outil fait, et que personne d&apos;autre ne fait dans la
                même session.
              </p>
            </Reveal>
            <div className="approach-grid">
              {DIFFERENTIATORS.map((d, i) => (
                <Reveal
                  key={d.num}
                  as="article"
                  className="approach-item"
                  delay={i === 0 ? undefined : (Math.min(i, 2) as 1 | 2)}
                >
                  <span className="approach-item__num">{d.num}</span>
                  <div>
                    <h3 className="approach-item__title">{d.title}</h3>
                    <p className="approach-item__desc">{d.desc}</p>
                    <span className="approach-item__hint">{d.hint}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== ARTIFACTS (deliverable) ===================== */}
        <section className="section section--band">
          <div className="wrap">
            <Reveal className="shead" style={{ marginBottom: "var(--s-7)" }}>
              <span className="kicker">
                <span className="shead__index">03</span>Le livrable
              </span>
              <h2 className="h2">Ce que vous avez à la fin de la session.</h2>
              <p className="shead__lede">
                Pas un PDF générique. Un document stratégique qui se lit en 10 minutes et
                s&apos;exécute le lendemain.
              </p>
            </Reveal>
            <ul className="artifacts">
              {ARTIFACTS.map((a, i) => (
                <Reveal
                  key={a.label}
                  as="li"
                  className="artifact"
                  delay={i === 0 ? undefined : (Math.min(i, 2) as 1 | 2)}
                >
                  <span className="artifact__label">{a.label}</span>
                  <p className="artifact__desc">{a.desc}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ===================== FAQ ===================== */}
        <section className="section" id="faq">
          <div className="wrap">
            <Reveal className="shead" style={{ marginBottom: "var(--s-7)" }}>
              <span className="kicker">
                <span className="shead__index">04</span>Questions
              </span>
              <h2 className="h2">Avant de commencer.</h2>
            </Reveal>
            <FAQAccordion items={ICP_FAQ} />
          </div>
        </section>

        {/* ===================== FINAL CTA ===================== */}
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
                  Choisissez votre cible <span className="serif-accent">en conscience.</span>
                </h2>
                <p className="lede">
                  Une session, 15 à 30 minutes, et vous repartez avec un ICP que vous pouvez
                  défendre, exécuter, et partager.
                </p>
                <div className="finalcta__cta">
                  <Link href="/signup" className="btn btn--primary">
                    Commencer une session
                    <ArrowRightIcon />
                  </Link>
                  <Link href="/login" className="btn btn--secondary">
                    Se connecter
                  </Link>
                </div>
                <p className="finalcta__fine">Gratuit. Sans carte bancaire.</p>
              </CursorGlow>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
