"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToolStore } from "@/lib/icp-tool/store";
import { BrandAside } from "@/components/icp-tool/auth/BrandAside";
import { toast } from "@/components/icp-tool/ui/ToastProvider";
import { ArrowRightIcon, BackIcon, SparkIcon } from "@/components/icp-tool/ui/icons";
import { track } from "@/lib/analytics";

export default function LoginPage() {
  const login = useToolStore((s) => s.login);
  const loginAsGuest = useToolStore((s) => s.loginAsGuest);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) {
      setError(res.error || "Échec de la connexion.");
      return;
    }
    track("ICP tool login");
    router.push("/icp/tool/dashboard");
  };

  const onGuest = () => {
    loginAsGuest();
    track("ICP tool guest login");
    toast("Connecté en invité. Vos données restent locales.", "info");
    router.push("/icp/tool/dashboard");
  };

  return (
    <>
      <BrandAside />
      <section className="auth__main">
        <div className="auth-card">
          <Link href="/icp" className="auth__back">
            <BackIcon /> Retour à la présentation
          </Link>
          <h1>Reconnecter votre session.</h1>
          <p className="auth-card__sub">
            Continuez où vous en étiez. Tout est sauvegardé localement.
          </p>

          <form className="auth-form" onSubmit={onSubmit} noValidate>
            <div className="icp-field">
              <label htmlFor="lg-email">Email</label>
              <input
                id="lg-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="vous@entreprise.com"
                autoComplete="email"
                inputMode="email"
                required
              />
            </div>
            <div className="icp-field">
              <label htmlFor="lg-pw">Mot de passe</label>
              <input
                id="lg-pw"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              {error && <p className="icp-field__err">{error}</p>}
            </div>
            <button className="btn btn--primary" type="submit">
              Se connecter
              <ArrowRightIcon />
            </button>
            <div style={{ textAlign: "center", marginTop: 4 }}>
              <Link
                href="/reset"
                style={{ fontSize: 13, color: "var(--text-3)", textDecoration: "underline" }}
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </form>

          <div className="auth__divider">ou</div>

          <button type="button" className="auth__guest" onClick={onGuest}>
            <SparkIcon />
            Continuer en invité
          </button>
          <p className="auth__guestNote">Mode dév · sera retiré quand Supabase est branché</p>

          <p className="auth__foot">
            Pas encore de compte ? <Link href="/signup">Créer un compte</Link>
          </p>
        </div>
      </section>
    </>
  );
}
