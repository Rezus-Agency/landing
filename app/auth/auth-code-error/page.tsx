import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div style={{ maxWidth: 420, textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
          Lien invalide ou expiré.
        </h1>
        <p style={{ color: "var(--text-3)", lineHeight: 1.6, marginBottom: 28 }}>
          Ce lien d&apos;authentification n&apos;a pas pu être validé. Il a peut-être déjà été
          utilisé ou a expiré. Réessayez de vous connecter.
        </p>
        <Link href="/login" className="btn btn--primary">
          Retour à la connexion
        </Link>
      </div>
    </main>
  );
}
