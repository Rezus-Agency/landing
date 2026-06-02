import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/effects/Reveal";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { ogImageUrl } from "@/lib/seo";
import { breadcrumbSchema, professionalServiceSchema } from "@/lib/json-ld";

const PAGE_TITLE = "Du compte cible au rendez-vous qualifié";
const PAGE_DESC =
  "Comment on transforme un ciblage chirurgical en rendez-vous qualifiés. Trois phases, aucun raccourci, une revue chaque semaine.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: "/methode" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: "/methode",
    type: "article",
    images: [{ url: ogImageUrl(PAGE_TITLE, "La méthode"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [ogImageUrl(PAGE_TITLE, "La méthode")],
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

const PHASES = [
  {
    num: "PHASE 01",
    title: "Cadrage & ciblage",
    lead: "On ne lance rien tant que la cible n'est pas chirurgicale. Le volume vient après la pertinence, jamais l'inverse.",
    items: [
      {
        b: "Définition de l'ICP réel",
        rest: ", construite avec vous à partir de vos meilleurs clients existants.",
      },
      {
        b: "Liste de comptes ciblée sur signaux d'achat",
        rest: " (financement récent, recrutement tech, projets en cours), plutôt qu'achetée en masse.",
      },
      {
        b: "Qualification sur signaux d'intention",
        rest: " vérifiables : levées, recrutements, changements de stack.",
      },
      {
        b: "Cartographie des décideurs",
        rest: " et d'un angle d'entrée pertinent par segment.",
      },
    ],
    callout: (
      <>
        <strong>~200 comptes vraiment pertinents</strong> par campagne. Pas 10 000 adresses devinées
        au hasard.
      </>
    ),
  },
  {
    num: "PHASE 02",
    title: "Messages & infrastructure",
    lead: "Chaque message est écrit pour une personne. L'infrastructure, elle, protège votre marque et votre délivrabilité.",
    items: [
      {
        b: "Un angle rédigé par segment",
        rest: ", construit avec l'IA pour la recherche et validé par un humain. Jamais un template unique.",
      },
      {
        b: "Domaines secondaires dédiés",
        rest: ", jamais votre domaine principal.",
      },
      {
        b: "Warmup progressif",
        rest: " et authentification complète : SPF, DKIM, DMARC.",
      },
      {
        b: "Deux relances maximum",
        rest: ", de la valeur d'abord, jamais de harcèlement.",
      },
    ],
    callout: (
      <>
        Votre <strong>domaine principal et votre réputation </strong> ne sont jamais exposés.
        C&apos;est la différence entre une campagne propre et un envoi de masse.
      </>
    ),
  },
  {
    num: "PHASE 03",
    title: "Pilotage & transparence",
    lead: "On optimise sur le seul indicateur qui compte : le rendez-vous qualifié. Une revue par semaine pour ajuster ce qui ne marche pas.",
    items: [
      {
        b: "Pilotage au rendez-vous qualifié",
        rest: ", pas au taux d'ouverture ni aux « impressions ».",
      },
      {
        b: "Revue hebdomadaire",
        rest: " avec ce qui marche, ce qu'on change, et pourquoi. Tout est visible.",
      },
      {
        b: "Itérations continues",
        rest: " sur l'angle et le ciblage, pas sur des vanity metrics.",
      },
      {
        b: "Sans engagement",
        rest: " : on reste parce que ça marche, pas parce qu'un contrat vous retient.",
      },
    ],
    callout: (
      <>
        Vous savez <strong>exactement ce qui part en votre nom</strong>, à qui, et avec quel angle.
        Rien n&apos;est caché.
      </>
    ),
  },
];

export default function MethodePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", path: "/" },
          { name: "La méthode", path: "/methode" },
        ])}
      />
      <JsonLd
        data={professionalServiceSchema({
          url: "/methode",
          name: "Méthode outbound Rezus Agency",
          description: PAGE_DESC,
          serviceType: "Outbound B2B · cold email",
        })}
      />
      <Header />

      <main id="main" tabIndex={-1}>
        {/* PAGE HERO */}
        <section className="phero">
          <div className="phero__bg" aria-hidden="true">
            <div className="hero__grid" />
          </div>
          <div className="wrap phero__inner">
            <Reveal as="span">
              <Link href="/" className="breadcrumb">
                <BreadcrumbIcon />
                Accueil
              </Link>
            </Reveal>
            <Reveal as="div" delay={1}>
              <h1>Du compte cible au rendez-vous qualifié.</h1>
            </Reveal>
            <Reveal as="div" delay={2}>
              <p className="lede">
                Comment on transforme un ciblage chirurgical en rendez-vous qualifiés. Trois phases,
                aucun raccourci, et une revue chaque semaine pour ajuster ce qui ne marche pas.
              </p>
            </Reveal>
            <Reveal className="phero__cta" delay={3}>
              <Link href="/contact" className="btn btn--primary">
                Réserver un appel
                <ArrowRightIcon />
              </Link>
              <Link href="/#comparaison" className="btn btn--secondary">
                Voir la comparaison
              </Link>
            </Reveal>
          </div>
        </section>

        {/* PHASES */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            {PHASES.map((phase) => (
              <Reveal key={phase.num} as="article" className="phase">
                <div className="phase__aside">
                  <span className="phase__num">{phase.num}</span>
                  <h2 className="phase__title">{phase.title}</h2>
                  <p className="phase__lead">{phase.lead}</p>
                </div>
                <div className="phase__body">
                  <ul className="flist">
                    {phase.items.map((item, i) => (
                      <li key={i}>
                        <CheckIcon />
                        <span>
                          <b>{item.b}</b>
                          {item.rest}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="callout">
                    <p>{phase.callout}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="section section--band">
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
                  Voyons ce que ça donne <span className="serif-accent">sur votre cible.</span>
                </h2>
                <p className="lede">
                  Un appel de 30 minutes pour regarder votre marché, vos comptes cibles, et vous
                  dire honnêtement si l&apos;outbound a du sens pour vous.
                </p>
                <div className="finalcta__cta">
                  <Link href="/contact" className="btn btn--primary">
                    Réserver un créneau
                    <ArrowRightIcon />
                  </Link>
                  <Link href="/#comparaison" className="btn btn--secondary">
                    Voir la comparaison
                  </Link>
                </div>
                <p className="finalcta__fine">Aucun engagement · Réponse sous 24 h</p>
              </CursorGlow>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
