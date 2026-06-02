import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/effects/Reveal";
import { BreadcrumbIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Rezus Agency.",
};

export default function MentionsLegalesPage() {
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
              <h1 style={{ marginTop: "var(--s-5)" }}>Mentions légales</h1>
            </Reveal>
            <Reveal as="p" delay={2} className="legal__updated">
              Dernière mise à jour : <span className="tofill">JJ/MM/2026</span>
            </Reveal>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "clamp(32px, 4vw, 56px)" }}>
          <div className="wrap legal">
            <div className="legal__body">
              <Reveal className="legal-block" id="editeur">
                <h2>1. Éditeur du site</h2>
                <p>
                  Le site <strong>rezus.agency</strong> est édité par :
                </p>
                <dl>
                  <dt>Raison sociale</dt>
                  <dd>
                    Rezus Agency <span className="tofill">(forme juridique à compléter)</span>
                  </dd>
                  <dt>Capital social</dt>
                  <dd>
                    <span className="tofill">à compléter</span>
                  </dd>
                  <dt>SIREN / SIRET</dt>
                  <dd>
                    <span className="tofill">à compléter</span>
                  </dd>
                  <dt>N° TVA</dt>
                  <dd>
                    <span className="tofill">à compléter</span>
                  </dd>
                  <dt>Siège social</dt>
                  <dd>
                    <span className="tofill">adresse à compléter</span>
                  </dd>
                  <dt>Email</dt>
                  <dd>
                    <a href="mailto:hello@rezus.agency">hello@rezus.agency</a>
                  </dd>
                </dl>
              </Reveal>

              <Reveal className="legal-block" id="publication">
                <h2>2. Direction de la publication</h2>
                <p>
                  Le directeur de la publication est{" "}
                  <span className="tofill">Nom du dirigeant à compléter</span>, en qualité de
                  représentant légal de Rezus Agency.
                </p>
              </Reveal>

              <Reveal className="legal-block" id="hebergement">
                <h2>3. Hébergement</h2>
                <p>Le site est hébergé par :</p>
                <dl>
                  <dt>Hébergeur</dt>
                  <dd>Vercel Inc.</dd>
                  <dt>Adresse</dt>
                  <dd>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</dd>
                  <dt>Site</dt>
                  <dd>
                    <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
                      vercel.com
                    </a>
                  </dd>
                </dl>
              </Reveal>

              <Reveal className="legal-block" id="propriete">
                <h2>4. Propriété intellectuelle</h2>
                <p>
                  L&apos;ensemble des contenus présents sur ce site (textes, identité visuelle,
                  logo, mise en page, code) est la propriété exclusive de Rezus Agency, sauf mention
                  contraire. Toute reproduction, représentation ou diffusion, totale ou partielle,
                  sans autorisation écrite préalable, est interdite et constituerait une contrefaçon
                  sanctionnée par le Code de la propriété intellectuelle.
                </p>
              </Reveal>

              <Reveal className="legal-block" id="responsabilite">
                <h2>5. Responsabilité</h2>
                <p>
                  Rezus Agency s&apos;efforce d&apos;assurer l&apos;exactitude des informations
                  diffusées sur ce site, mais ne saurait être tenue responsable des omissions,
                  inexactitudes ou carences de mise à jour, qu&apos;elles soient de son fait ou du
                  fait de tiers partenaires.
                </p>
                <p>
                  Les études et sources citées dans la section comparaison sont fournies à titre
                  informatif ; les liens renvoient vers leurs publications d&apos;origine.
                </p>
              </Reveal>

              <Reveal className="legal-block" id="liens">
                <h2>6. Liens hypertextes</h2>
                <p>
                  Ce site peut contenir des liens vers des sites tiers. Rezus Agency n&apos;exerce
                  aucun contrôle sur ces ressources externes et décline toute responsabilité quant à
                  leur contenu ou leur disponibilité.
                </p>
              </Reveal>

              <Reveal className="legal-block" id="donnees">
                <h2>7. Données personnelles</h2>
                <p>
                  Le traitement de vos données personnelles est décrit en détail dans notre{" "}
                  <Link href="/politique-confidentialite">politique de confidentialité</Link>.
                </p>
              </Reveal>

              <Reveal className="legal-block" id="droit">
                <h2>8. Droit applicable</h2>
                <p>
                  Les présentes mentions légales sont régies par le droit français. En cas de
                  litige, et à défaut de résolution amiable, les tribunaux français seront seuls
                  compétents.
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
