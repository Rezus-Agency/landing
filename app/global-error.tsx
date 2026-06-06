"use client";

/**
 * Error boundary racine : remplace le root layout si l'erreur survient dans le
 * layout lui-même. Doit rendre <html>/<body> ; styles inline (globals.css peut
 * ne pas être appliqué ici).
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0d0b09",
          color: "#f0e8de",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
            Une erreur est survenue.
          </h1>
          <p style={{ color: "#a89f94", lineHeight: 1.6, marginBottom: 24 }}>
            Un problème inattendu nous empêche d&apos;afficher cette page. Réessayez dans un instant.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              background: "#f0e8de",
              color: "#0d0b09",
              border: "none",
              borderRadius: 10,
              padding: "11px 20px",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
