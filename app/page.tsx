import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroReady } from "@/components/effects/HeroReady";
import { Reveal } from "@/components/effects/Reveal";
import { FAQAccordion } from "@/components/effects/FAQAccordion";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { ArrowRightIcon, ArrowUpRightIcon, CheckIcon, MinusIcon } from "@/components/icons";
import { COMPARISON_AXES } from "@/lib/comparison-axes";
import { HOMEPAGE_FAQ } from "@/lib/faq-items";

const num = (i: number) => String(i + 1).padStart(2, "0");

export default function HomePage() {
  return (
    <>
      <HeroReady />
      <Header />

      <main id="top">
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
              Pour les fondateurs de boîtes tech B2B qui veulent des rendez-vous qualifiés, pas 10
              000 emails envoyés dans le vide. Du ciblage chirurgical, écrit à la main, mesuré au
              pipeline.
            </p>

            <div className="hero__cta" data-anim style={{ "--d": "0.54s" } as React.CSSProperties}>
              <Link href="/contact" className="btn btn--primary">
                Réserver un appel
                <ArrowRightIcon />
              </Link>
              <Link href="#methode" className="btn btn--secondary">
                Voir la méthode
              </Link>
            </div>
          </div>
        </section>

        {/* ===================== PAIN ===================== */}
        <section className="section section--tight section--band" id="pain">
          <div className="wrap">
            <Reveal className="shead" style={{ marginBottom: "var(--s-7)" } as React.CSSProperties}>
              <span className="kicker">
                <span className="shead__index">01</span>Vous l&apos;avez déjà vécu
              </span>
            </Reveal>
            <div className="pains">
              <Reveal as="article" className="pain">
                <span className="pain__num">01</span>
                <p>
                  Vous avez déjà payé une agence outbound.{" "}
                  <b>Beaucoup d&apos;emails envoyés. Zéro rendez-vous sérieux.</b>
                </p>
                <span className="pain__hint">Le volume ne remplace pas la pertinence.</span>
              </Reveal>
              <Reveal as="article" className="pain" delay={1}>
                <span className="pain__num">02</span>
                <p>
                  Vos prospects reçoivent <b>40 messages copiés-collés par semaine.</b> Le vôtre
                  fini en spam comme les autres.
                </p>
                <span className="pain__hint">Se fondre dans la masse, c&apos;est disparaître.</span>
              </Reveal>
              <Reveal as="article" className="pain" delay={2}>
                <span className="pain__num">03</span>
                <p>
                  Vous savez reconnaître un travail bâclé.{" "}
                  <b>Et la plupart des agences en font un.</b>
                </p>
                <span className="pain__hint">Vous méritez le niveau de vos propres outils.</span>
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
                Dix points de friction de l&apos;outbound volumique, et notre alternative. Chaque
                affirmation est sourcée. Vérifiez par vous-même.
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
                Pas de boîte noire. Voici exactement comment on travaille, étape par étape.
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
                    On définit l&apos;ICP réel et on construit une liste de comptes à la main,
                    compte par compte.
                  </p>
                  <span className="tl-hint">Signaux d&apos;intention &gt; listes achetées</span>
                </div>
              </Reveal>
              <Reveal as="article" className="tl-step" delay={1}>
                <div className="tl-node">
                  <span>02</span>
                </div>
                <div className="tl-body">
                  <h3 className="tl-title">Messages écrits, infra propre</h3>
                  <p className="tl-desc">
                    Un angle rédigé par segment, des domaines secondaires dédiés et un warmup
                    sérieux avant le moindre envoi.
                  </p>
                  <span className="tl-hint">Votre domaine principal n&apos;est jamais exposé</span>
                </div>
              </Reveal>
              <Reveal as="article" className="tl-step" delay={2}>
                <div className="tl-node">
                  <span>03</span>
                </div>
                <div className="tl-body">
                  <h3 className="tl-title">Pilotage au pipeline</h3>
                  <p className="tl-desc">
                    On optimise sur les rendez-vous qualifiés, pas sur les taux d&apos;ouverture.
                    Vous suivez tout en temps réel.
                  </p>
                  <span className="tl-hint">Accès complet à toutes les séquences</span>
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
                    Vous vendez un produit tech B2B avec un ticket qui justifie un travail
                    sur-mesure.
                  </li>
                  <li>
                    <CheckIcon />
                    Vous préférez 30 conversations pertinentes à 3 000 emails ignorés.
                  </li>
                  <li>
                    <CheckIcon />
                    Vous voulez protéger votre marque et votre domaine.
                  </li>
                  <li>
                    <CheckIcon />
                    Vous jugez sur le pipeline, pas sur des vanity metrics.
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
                    Vous cherchez le plus gros volume au prix le plus bas.
                  </li>
                  <li>
                    <MinusIcon />
                    Vous voulez « 500 leads garantis » dès le mois un.
                  </li>
                  <li>
                    <MinusIcon />
                    Votre cible n&apos;est pas claire et vous ne voulez pas la travailler.
                  </li>
                  <li>
                    <MinusIcon />
                    Vous voyez l&apos;outbound comme un robinet à spammer.
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
                  Aucun engagement · Réponse sous 24 h · Calendly sur la page contact
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
