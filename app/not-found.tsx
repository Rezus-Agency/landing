import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Page introuvable",
  description:
    "Cette page n'existe pas ou a été déplacée. Retour à l'accueil de Rezus Agency.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Header />

      <main id="main" tabIndex={-1} className="e404">
        <div className="e404__bg" aria-hidden="true">
          <div className="e404__glow" />
          <div className="e404__grid" />
        </div>

        <div className="e404__inner">
          <span className="e404__code">Erreur 404</span>

          <div className="e404__mark is-in" aria-label="404">
            <span>4</span>
            <span className="e404__z">0</span>
            <span>4</span>
          </div>

          <h1 className="e404__title">Cette page a filé sans laisser d&apos;adresse.</h1>

          <p className="e404__lede">
            Le lien est peut-être cassé, ou la page a été déplacée. Rien de grave, voici par
            où repartir.
          </p>

          <div className="e404__cta">
            <Link href="/" className="btn btn--primary">
              Retour à l&apos;accueil
              <ArrowRightIcon />
            </Link>
            <Link href="/contact" className="btn btn--secondary">
              Nous contacter
            </Link>
          </div>

          <nav className="e404__links" aria-label="Liens utiles">
            <Link href="/methode">Méthode</Link>
            <Link href="/#comparison">La comparaison</Link>
            <Link href="/icp">ICP Tool</Link>
            <Link href="/#faq">FAQ</Link>
          </nav>
        </div>
      </main>

      <footer className="e404__footer" role="contentinfo">
        <div className="wrap e404__footerInner">
          <span>© {new Date().getFullYear()} Rezus Agency · France</span>
          <span>
            <Link href="/mentions-legales">Mentions légales</Link>
            {" · "}
            <Link href="/politique-confidentialite">Confidentialité</Link>
          </span>
        </div>
      </footer>
    </>
  );
}
