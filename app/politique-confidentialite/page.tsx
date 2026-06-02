import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/effects/Reveal";
import { BreadcrumbIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Comment Rezus Agency collecte et traite vos données personnelles (RGPD).",
  alternates: { canonical: "/politique-confidentialite" },
  robots: { index: true, follow: true },
};

export default function ConfidentialitePage() {
  return (
    <>
      <Header />

      <main>
        <section className="phero" style={{ paddingBottom: "clamp(24px, 3vw, 40px)" }}>
          <div className="phero__bg" aria-hidden="true">
            <div className="hero__grid" />
          </div>
          <div className="wrap phero__inner phero__inner--legal">
            <Reveal as="span">
              <Link href="/" className="breadcrumb">
                <BreadcrumbIcon />
                Accueil
              </Link>
            </Reveal>
            <Reveal as="div" delay={1}>
              <h1 style={{ marginTop: "var(--s-5)" }}>Politique de confidentialité</h1>
            </Reveal>
            <Reveal as="div" delay={2}>
              <p className="lede" style={{ marginTop: "var(--s-4)", maxWidth: "56ch" }}>
                On collecte le minimum, on l&apos;explique clairement, et on ne revend rien. Voici
                le détail.
              </p>
            </Reveal>
            <Reveal as="p" delay={2} className="legal__updated">
              Dernière mise à jour : <span className="tofill">JJ/MM/2026</span>
            </Reveal>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "clamp(32px, 4vw, 56px)" }}>
          <div className="wrap legal">
            <div className="legal__body">
              <Reveal className="legal-block" id="responsable">
                <h2>1. Responsable du traitement</h2>
                <p>
                  Le responsable du traitement de vos données personnelles est Rezus Agency. Pour
                  toute question relative à vos données, écrivez à{" "}
                  <a href="mailto:hello@rezus.agency">hello@rezus.agency</a>.
                </p>
              </Reveal>

              <Reveal className="legal-block" id="donnees">
                <h2>2. Données que nous collectons</h2>
                <p>Nous ne collectons que les données strictement nécessaires :</p>
                <ul>
                  <li>
                    <strong>Formulaire de contact</strong> : nom, email professionnel, entreprise
                    (facultatif) et le contenu de votre message.
                  </li>
                  <li>
                    <strong>Compte ICP Tool</strong> : email, mot de passe, nom et entreprise pour
                    accéder à votre espace.
                  </li>
                  <li>
                    <strong>Prospection</strong> : données professionnelles publiques relatives aux
                    comptes ciblés (nom, fonction, email professionnel, entreprise).
                  </li>
                  <li>
                    <strong>Navigation</strong> : données techniques et de mesure d&apos;audience
                    (voir la section cookies).
                  </li>
                </ul>
              </Reveal>

              <Reveal className="legal-block" id="finalites">
                <h2>3. Finalités</h2>
                <ul>
                  <li>Répondre à vos demandes et organiser un éventuel rendez-vous.</li>
                  <li>Vous permettre d&apos;utiliser l&apos;ICP Tool et de gérer votre compte.</li>
                  <li>
                    Mener une prospection B2B pertinente et ciblée pour le compte de nos clients.
                  </li>
                  <li>Mesurer l&apos;audience et améliorer le site.</li>
                </ul>
              </Reveal>

              <Reveal className="legal-block" id="base">
                <h2>4. Base légale</h2>
                <p>Selon le traitement, nous nous appuyons sur :</p>
                <ul>
                  <li>
                    Votre <strong>consentement</strong> (cookies non essentiels), art. 6.1.a du
                    RGPD.
                  </li>
                  <li>
                    L&apos;<strong>intérêt légitime</strong> (prospection B2B, sécurité du site),
                    art. 6.1.f du RGPD.
                  </li>
                  <li>
                    L&apos;exécution de <strong>mesures précontractuelles</strong> à votre demande,
                    art. 6.1.b du RGPD.
                  </li>
                </ul>
              </Reveal>

              <Reveal className="legal-block" id="duree">
                <h2>5. Durées de conservation</h2>
                <dl>
                  <dt>Demandes de contact</dt>
                  <dd>3 ans à compter du dernier échange.</dd>
                  <dt>Compte ICP Tool</dt>
                  <dd>Jusqu&apos;à votre demande de suppression du compte.</dd>
                  <dt>Prospection</dt>
                  <dd>3 ans à compter du dernier contact, ou jusqu&apos;à opposition.</dd>
                  <dt>Mesure d&apos;audience</dt>
                  <dd>
                    <span className="tofill">durée à compléter</span> (13 mois max recommandés).
                  </dd>
                </dl>
              </Reveal>

              <Reveal className="legal-block" id="destinataires">
                <h2>6. Destinataires &amp; sous-traitants</h2>
                <p>
                  Vos données ne sont jamais revendues. Elles peuvent être traitées par des
                  prestataires techniques agissant pour notre compte :
                </p>
                <ul>
                  <li>
                    <strong>Vercel Inc.</strong> : hébergement du site (États-Unis, transferts
                    encadrés par les clauses contractuelles types).
                  </li>
                  <li>
                    <strong>Calendly</strong> : prise de rendez-vous.
                  </li>
                  <li>
                    <strong>Outil d&apos;emailing</strong> :{" "}
                    <span className="tofill">prestataire à compléter</span>.
                  </li>
                </ul>
              </Reveal>

              <Reveal className="legal-block" id="cookies">
                <h2>7. Cookies</h2>
                <p>
                  Le site utilise des cookies strictement nécessaires à son fonctionnement, ainsi
                  que des cookies de mesure d&apos;audience soumis à votre consentement. Vous pouvez
                  à tout moment modifier vos préférences via les réglages de votre navigateur.
                </p>
              </Reveal>

              <Reveal className="legal-block" id="droits">
                <h2>8. Vos droits</h2>
                <p>
                  Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des
                  droits d&apos;accès, de rectification, d&apos;effacement, de limitation,
                  d&apos;opposition et de portabilité de vos données.
                </p>
                <p>
                  Pour les exercer, écrivez à{" "}
                  <a href="mailto:hello@rezus.agency">hello@rezus.agency</a>. Vous pouvez également
                  introduire une réclamation auprès de la{" "}
                  <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
                    CNIL
                  </a>
                  .
                </p>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
