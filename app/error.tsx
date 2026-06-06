"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { ArrowRightIcon } from "@/components/icons";

/**
 * Error boundary des routes (rendu dans le root layout : html/body/styles présents).
 * On n'affiche jamais le détail de l'erreur (pas de fuite en prod).
 */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <>
      <Header />

      <main id="main" tabIndex={-1} className="e404">
        <div className="e404__bg" aria-hidden="true">
          <div className="e404__glow" />
          <div className="e404__grid" />
        </div>

        <div className="e404__inner">
          <span className="e404__code">Erreur</span>
          <h1 className="e404__title">Quelque chose s&apos;est mal passé.</h1>
          <p className="e404__lede">
            Une erreur inattendue est survenue. Vous pouvez réessayer, ou revenir à l&apos;accueil.
          </p>

          <div className="e404__cta">
            <button type="button" className="btn btn--primary" onClick={() => reset()}>
              Réessayer
              <ArrowRightIcon />
            </button>
            <Link href="/" className="btn btn--secondary">
              Retour à l&apos;accueil
            </Link>
          </div>
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
