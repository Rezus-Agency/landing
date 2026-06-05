"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BrandAside } from "@/components/icp-tool/auth/BrandAside";
import { GoogleButton } from "@/components/icp-tool/auth/GoogleButton";
import { ArrowRightIcon, BackIcon } from "@/components/icp-tool/ui/icons";
import { track } from "@/lib/analytics";

function safeNext(raw: string | null): string {
  if (raw && raw.startsWith("/")) return raw;
  return "/icp/tool/dashboard";
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = safeNext(search.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setLoading(false);
      setError(
        err.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect."
          : err.message === "Email not confirmed"
            ? "Confirmez votre email via le lien reçu avant de vous connecter."
            : err.message,
      );
      return;
    }
    track("ICP tool login");
    router.push(next);
    router.refresh();
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
          <p className="auth-card__sub">Continuez où vous en étiez.</p>

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
            <button className="btn btn--primary" type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
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

          <GoogleButton next={next} />

          <p className="auth__foot">
            Pas encore de compte ? <Link href="/signup">Créer un compte</Link>
          </p>
        </div>
      </section>
    </>
  );
}
