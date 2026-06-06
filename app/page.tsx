import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroReady } from "@/components/effects/HeroReady";
import { Reveal } from "@/components/effects/Reveal";
import { FAQAccordion } from "@/components/effects/FAQAccordion";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowRightIcon, ArrowUpRightIcon, CheckIcon, MinusIcon } from "@/components/icons";
import { COMPARISON_AXES } from "@/lib/comparison-axes";
import { HOMEPAGE_FAQ } from "@/lib/faq-items";
import { faqPageSchema } from "@/lib/json-ld";

const num = (i: number) => String(i + 1).padStart(2, "0");

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqPageSchema} />
      <HeroReady />
      <Header />

      <main id="main" tabIndex={-1}>
        {/* ===================== HERO ===================== */}
        <section className="hero" id="hero">
          <div className="hero__bg" aria-hidden="true">
            <div className="hero__grid" />
            <div className="hero__glow" />
          </div>
          <div className="wrap hero__inner">
            <span className="hero__tag" data-anim style={{ "--d": "0.05s" } as React.CSSProperties}>
              <span className="dot" />
              Outbound B2B · France
            </span>

            <div className="hero__h1mask">
              <h1 className="h-display">
                Outbound qui n&apos;a{" "}
                <span className="hero__strike">
                  rien à voir
                  <svg
                    className="hero__brush"
                    viewBox="0 0 320 26"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path d="M5 16 C 58 8, 96 20, 150 13 C 206 6, 250 19, 300 9" />
                    <path
                      className="hero__brush--wisp"
                      d="M12 20 C 70 14, 130 23, 196 16 C 244 11, 280 20, 308 15"
                    />
                  </svg>
                </span>{" "}
                avec du spam.
              </h1>
            </div>

            <p
              className="lede hero__sub"
              data-anim
              style={{ "--d": "0.42s" } as React.CSSProperties}
            >
              Pour agences B2B francophones qui veulent un flux régulier de leads qualifiés. Comptes
              ciblés sur signaux d&apos;achat, messages personnalisés par segment, ajustés chaque
              semaine.
            </p>

            <div
              className="hero__cta"
              data-anim
              style={{ "--d": "0.54s", gap: "var(--s-5)" } as React.CSSProperties}
            >
              <Link href="/contact" className="btn btn--primary">
                Réserver un appel
                <ArrowRightIcon />
              </Link>
              <Link href="/icp" className="btn btn--secondary">
                Créer mon ICP gratuit
                <ArrowUpRightIcon />
              </Link>
              <Link href="#methode" className="btn btn--ghost" style={{ color: "var(--text-3)" }}>
                Voir la méthode
              </Link>
            </div>

            <div className="hero-stats" data-anim style={{ "--d": "0.7s" } as React.CSSProperties}>
              <span className="hero-stat">
                <span className="hero-stat__n">200</span>
                <span>comptes max / campagne</span>
              </span>
              <span className="hero-stat__sep" aria-hidden="true">
                ·
              </span>
              <span className="hero-stat">
                <span className="hero-stat__n">0</span>
                <span>templates copiés-collés</span>
              </span>
              <span className="hero-stat__sep" aria-hidden="true">
                ·
              </span>
              <span className="hero-stat">
                <span className="hero-stat__n">3+</span>
                <span>domaines secondaires</span>
              </span>
              <span className="hero-stat__sep" aria-hidden="true">
                ·
              </span>
              <span className="hero-stat">
                <span className="hero-stat__n">2</span>
                <span>relances maximum</span>
              </span>
            </div>
          </div>
        </section>

        {/* ===================== PAIN ===================== */}
        <section className="section section--tight section--band" id="pain">
          <div className="wrap">
            <Reveal className="shead" style={{ marginBottom: "var(--s-7)" } as React.CSSProperties}>
              <span className="kicker">
                <span className="shead__index">01</span>Le scénario par défaut
              </span>
              <h2 className="h2">Pourquoi 9 agences sur 10 vous déçoivent.</h2>
            </Reveal>
            <div className="pains">
              <Reveal as="article" className="pain">
                <span className="pain__num">MOIS 1</span>
                <p>
                  <b>« 50 rendez-vous qualifiés par mois, garantis. »</b>
                  &nbsp;L&apos;agence est rassurante. Le contrat de 12 mois est signé.
                </p>
                <span className="pain__hint">La promesse tient sur une slide.</span>
              </Reveal>
              <Reveal as="article" className="pain" delay={1}>
                <span className="pain__num">MOIS 2</span>
                <p>
                  <b>200 emails envoyés, 2 réponses sérieuses.</b>
                  &nbsp;Le message est générique, les comptes ne collent pas, la délivrabilité
                  baisse.
                </p>
                <span className="pain__hint">Reply rate moyen en cold email 2026 : 3,4%.</span>
              </Reveal>
              <Reveal as="article" className="pain" delay={2}>
                <span className="pain__num">MOIS 4</span>
                <p>
                  <b>Domaine grillé.</b>
                  &nbsp;Vous arrêtez. Budget perdu, marque associée au spam, et six mois à
                  reconstruire votre réputation.
                </p>
                <span className="pain__hint">Ce n&apos;est pas l&apos;outbound qui est cassé.</span>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ===================== COMPARISON ===================== */}
        <section className="section" id="comparaison">
          <div className="wrap">
            <Reveal className="shead">
              <span className="kicker">
                <span className="shead__index">02</span>La comparaison
              </span>
              <h2 className="h2">
                Ce que fait la plupart.
                <br />
                Ce qu&apos;on fait à la place.
              </h2>
              <p className="shead__lede">
                Cinq zones où la qualité du travail change ce que vous touchez : pipeline,
                réputation, deals. Chaque affirmation est sourcée. Vérifiez par vous-même.
              </p>
            </Reveal>

            <div className="cmp" aria-live="polite">
              <div className="cmp--editorial">
                {COMPARISON_AXES.map((a, i) => (
                  <Reveal key={a.axis} className="cmp-row">
                    <div className="cmp-row__num">{num(i)}</div>
                    <div className="cmp-axis">{a.axis}</div>
                    <div className="cmp-cell cmp-them">
                      <span className="cmp-cell__label">
                        <span className="cmp-tag cmp-tag--them">La plupart</span>
                      </span>
                      <span className="cmp-cell__text">{a.them}</span>
                    </div>
                    <div className="cmp-cell cmp-us">
                      <span className="cmp-cell__label">
                        <span className="cmp-tag cmp-tag--us">Rezus</span>
                      </span>
                      <span className="cmp-cell__text">{a.us}</span>
                      <span className="src-line">
                        <a
                          className="cmp-src"
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ArrowUpRightIcon />
                          {a.src}
                        </a>
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===================== MÉTHODE (preview) ===================== */}
        <section className="section section--tight section--band" id="methode">
          <div className="wrap faq-layout">
            <Reveal className="shead faq-aside">
              <span className="kicker">
                <span className="shead__index">03</span>La méthode, en bref
              </span>
              <h2 className="h2">Trois temps. Aucun raccourci.</h2>
              <p className="shead__lede">
                Voici exactement comment on travaille, étape par étape. Tout est visible.
              </p>
              <Link
                href="/methode"
                className="btn btn--ghost"
                style={{ marginTop: "var(--s-3)", paddingLeft: 0 }}
              >
                Lire la méthode complète
                <ArrowRightIcon />
              </Link>
            </Reveal>
            <div className="timeline">
              <Reveal as="article" className="tl-step">
                <div className="tl-node">
                  <span>01</span>
                </div>
                <div className="tl-body">
                  <h3 className="tl-title">Cadrage &amp; ciblage</h3>
                  <p className="tl-desc">
                    On définit l&apos;ICP réel et on cible les comptes sur des signaux
                    d&apos;intention vérifiables : financement, recrutement tech, projets en cours.
                  </p>
                  <span className="tl-hint">Signaux d&apos;intention &gt; listes achetées</span>
                </div>
              </Reveal>
              <Reveal as="article" className="tl-step" delay={1}>
                <div className="tl-node">
                  <span>02</span>
                </div>
                <div className="tl-body">
                  <h3 className="tl-title">Messages personnalisés, infra propre</h3>
                  <p className="tl-desc">
                    Un angle par segment, construit avec l&apos;IA pour la recherche et validé par
                    un humain. Domaines secondaires dédiés et warmup avant le moindre envoi.
                  </p>
                  <span className="tl-hint">Votre domaine principal n&apos;est jamais exposé</span>
                </div>
              </Reveal>
              <Reveal as="article" className="tl-step" delay={2}>
                <div className="tl-node">
                  <span>03</span>
                </div>
                <div className="tl-body">
                  <h3 className="tl-title">Revue hebdomadaire, ajustement continu</h3>
                  <p className="tl-desc">
                    Chaque semaine : reporting clair, ce qui marche, ce qu&apos;on ajuste. Sans
                    engagement. Vous restez informé sur ce qui change et pourquoi.
                  </p>
                  <span className="tl-hint">Tout est visible, jamais de set &amp; forget</span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ===================== POUR QUI ===================== */}
        <section className="section" id="pour-qui">
          <div className="wrap">
            <Reveal className="shead">
              <span className="kicker">
                <span className="shead__index">04</span>Auto-qualification
              </span>
              <h2 className="h2">On n&apos;est pas pour tout le monde.</h2>
              <p className="shead__lede">
                Et c&apos;est volontaire. Voici comment savoir en dix secondes si on doit se parler.
              </p>
            </Reveal>
            <div className="qual">
              <Reveal className="qual-col qual-col--us">
                <div className="qual-col__head">
                  <span className="qual-col__icon">
                    <CheckIcon />
                  </span>
                  <h3 className="h3">Fait pour vous si…</h3>
                </div>
                <ul className="qual-list">
                  <li>
                    <CheckIcon />
                    Vous êtes une agence B2B (5 à 50 personnes) qui veut sécuriser un flux régulier
                    de leads qualifiés.
                  </li>
                  <li>
                    <CheckIcon />
                    Vous avez des références solides mais le bouche-à-oreille plafonne ou est
                    saisonnier.
                  </li>
                  <li>
                    <CheckIcon />
                    Vous voulez sortir de Malt, Upwork et des marketplaces, et travailler vos
                    propres comptes cibles.
                  </li>
                  <li>
                    <CheckIcon />
                    Vous êtes prêt à construire sur 6 mois minimum, pas à signer pour trois emails.
                  </li>
                </ul>
              </Reveal>
              <Reveal className="qual-col qual-col--them" delay={1}>
                <div className="qual-col__head">
                  <span className="qual-col__icon">
                    <MinusIcon />
                  </span>
                  <h3 className="h3">Pas fait pour vous si…</h3>
                </div>
                <ul className="qual-list">
                  <li>
                    <MinusIcon />
                    Vous démarrez tout juste, sans portfolio crédible ni positionnement clair.
                  </li>
                  <li>
                    <MinusIcon />
                    Vous cherchez « 50 leads garantis dès le mois un » pour combler un trou de
                    pipeline immédiat.
                  </li>
                  <li>
                    <MinusIcon />
                    Vous mesurez le succès en emails envoyés ou en taux d&apos;ouverture.
                  </li>
                  <li>
                    <MinusIcon />
                    L&apos;outbound est pour vous un robinet à scaler, pas une démarche commerciale.
                  </li>
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ===================== FAQ ===================== */}
        <section className="section section--band" id="faq">
          <div className="wrap faq-layout">
            <Reveal className="shead faq-aside">
              <span className="kicker">
                <span className="shead__index">05</span>FAQ
              </span>
              <h2 className="h2">Les questions qu&apos;on nous pose.</h2>
              <p className="shead__lede">
                Vous ne trouvez pas votre réponse ? Écrivez-nous, on répond sous 24 h.
              </p>
            </Reveal>
            <FAQAccordion items={HOMEPAGE_FAQ} />
          </div>
        </section>

        {/* ===================== FINAL CTA ===================== */}
        <section className="section" id="contact">
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
                  Parlons de votre pipeline, <span className="serif-accent">pas de promesses.</span>
                </h2>
                <p className="lede">
                  Un appel de 30 minutes. On regarde votre cible, on vous dit honnêtement si
                  l&apos;outbound a du sens pour vous, et si on est les bons pour le faire.
                </p>
                <div className="finalcta__cta">
                  <Link href="/contact" className="btn btn--primary">
                    Réserver un créneau
                    <ArrowRightIcon />
                  </Link>
                  <Link href="/methode" className="btn btn--secondary">
                    Voir la méthode d&apos;abord
                  </Link>
                </div>
                <p className="finalcta__fine">
                  30 min · Aucun engagement · On vous dit non si on n&apos;est pas les bons
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
