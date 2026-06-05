"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BrandAside } from "@/components/icp-tool/auth/BrandAside";
import { ArrowRightIcon, BackIcon, CheckIcon } from "@/components/icp-tool/ui/icons";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    // On laisse toujours afficher l'écran "vérifiez votre boîte" même en cas
    // d'erreur, pour ne pas révéler si l'email existe (anti-énumération).
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?next=/update-password`,
    });
    setLoading(false);
    setSent(true);
  };

  return (
    <>
      <BrandAside />
      <section className="auth__main">
        <div className="auth-card">
          <Link href="/login" className="auth__back">
            <BackIcon /> Retour à la connexion
          </Link>

          {sent ? (
            <>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 11,
                  display: "grid",
                  placeItems: "center",
                  background: "color-mix(in oklch, var(--accent) 14%, transparent)",
                  color: "var(--accent)",
                  marginBottom: 16,
                }}
              >
                <CheckIcon />
              </div>
              <h1>Vérifiez votre boîte.</h1>
              <p className="auth-card__sub">
                Si un compte existe pour <b>{email}</b>, un lien de réinitialisation va vous
                arriver dans quelques minutes.
              </p>
              <div style={{ marginTop: 28 }}>
                <Link href="/login" className="btn btn--secondary">
                  Retour à la connexion
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1>Mot de passe oublié ?</h1>
              <p className="auth-card__sub">
                Entrez votre email, on vous envoie un lien pour le réinitialiser.
              </p>
              <form className="auth-form" onSubmit={onSubmit} noValidate>
                <div className="icp-field">
                  <label htmlFor="rs-email">Email</label>
                  <input
                    id="rs-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@entreprise.com"
                    autoComplete="email"
                    inputMode="email"
                    required
                  />
                </div>
                <button className="btn btn--primary" type="submit" disabled={loading}>
                  {loading ? "Envoi..." : "Envoyer le lien"}
                  <ArrowRightIcon />
                </button>
              </form>
              <p className="auth__foot">
                Pas encore de compte ? <Link href="/signup">Créer un compte</Link>
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
