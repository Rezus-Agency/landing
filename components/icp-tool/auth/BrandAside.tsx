"use client";

/**
 * Colonne gauche des pages auth (login/signup/reset).
 * Brand row + tagline + h2 + lede + 3 micro-steps.
 */

export function BrandAside() {
  return (
    <aside className="auth__aside">
      <div className="auth__grid" aria-hidden="true" />
      <div className="auth__brandRow">
        <span className="logo__mark">Rezus</span>
        <span className="logo__word">ICP Discovery</span>
      </div>

      <div className="auth__pitch">
        <span className="tagline">ICP discovery. Pas validation.</span>
        <h2>L&apos;outil qui vous fait choisir votre cible en conscience.</h2>
        <p>
          Un consultant stratégique compressé en outil. Il challenge votre intuition, recherche le
          marché en direct, et livre une analyse exploitable.
        </p>
      </div>

      <div className="auth__steps">
        <div className="auth__step">
          <span>01</span>
          Vous décrivez votre cible
        </div>
        <div className="auth__step">
          <span>02</span>
          L&apos;outil challenge et recherche
        </div>
        <div className="auth__step">
          <span>03</span>
          Vous repartez avec un ICP exécutable
        </div>
      </div>
    </aside>
  );
}
