"use client";

/**
 * Page de définition d'un nouveau mot de passe.
 * Atteinte après clic sur le lien de reset (-> /auth/confirm -> ici, session active).
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BrandAside } from "@/components/icp-tool/auth/BrandAside";
import { ArrowRightIcon, BackIcon } from "@/components/icp-tool/ui/icons";
import { toast } from "@/components/icp-tool/ui/ToastProvider";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("8 caractères minimum.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(
        err.message.includes("session")
          ? "Lien expiré. Redemandez un email de réinitialisation."
          : err.message,
      );
      return;
    }
    toast("Mot de passe mis à jour.", "success");
    router.push("/icp/tool/dashboard");
    router.refresh();
  };

  return (
    <>
      <BrandAside />
      <section className="auth__main">
        <div className="auth-card">
          <Link href="/login" className="auth__back">
            <BackIcon /> Retour à la connexion
          </Link>
          <h1>Nouveau mot de passe.</h1>
          <p className="auth-card__sub">Choisissez un mot de passe pour votre compte.</p>

          <form className="auth-form" onSubmit={onSubmit} noValidate>
            <div className={`icp-field ${error ? "invalid" : ""}`}>
              <label htmlFor="up-pw">Mot de passe</label>
              <input
                id="up-pw"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="8 caractères minimum"
                autoComplete="new-password"
                required
              />
              {error && <p className="icp-field__err">{error}</p>}
            </div>
            <button className="btn btn--primary" type="submit" disabled={loading}>
              {loading ? "Mise à jour..." : "Mettre à jour"}
              <ArrowRightIcon />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
