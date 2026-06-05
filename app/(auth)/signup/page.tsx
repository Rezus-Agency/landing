"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BrandAside } from "@/components/icp-tool/auth/BrandAside";
import { GoogleButton } from "@/components/icp-tool/auth/GoogleButton";
import { ArrowRightIcon, BackIcon, CheckIcon } from "@/components/icp-tool/ui/icons";
import { track } from "@/lib/analytics";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function safeNext(raw: string | null): string {
  if (raw && raw.startsWith("/")) return raw;
  return "/icp/tool/dashboard";
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const search = useSearchParams();
  const next = safeNext(search.get("next"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErr: typeof errors = {};
    if (!EMAIL_RE.test(email)) nextErr.email = "Indiquez un email valide.";
    if (password.length < 8) nextErr.password = "8 caractères minimum.";
    setErrors(nextErr);
    if (Object.keys(nextErr).length > 0) return;

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}`,
      },
    });
    setLoading(false);
    if (error) {
      setErrors({ email: error.message });
      return;
    }
    track("ICP tool signup");
    setSent(true);
  };

  return (
    <>
      <BrandAside />
      <section className="auth__main">
        <div className="auth-card">
          <Link href="/icp" className="auth__back">
            <BackIcon /> Retour à la présentation
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
              <h1>Vérifiez votre email.</h1>
              <p className="auth-card__sub">
                Un lien de confirmation a été envoyé à <b>{email}</b>. Cliquez dessus pour activer
                votre compte et accéder à l&apos;outil.
              </p>
              <div style={{ marginTop: 28 }}>
                <Link href="/login" className="btn btn--secondary">
                  Retour à la connexion
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1>Démarrez une session.</h1>
              <p className="auth-card__sub">
                15 à 30 minutes. Vous repartez avec un ICP stratégique exploitable.
              </p>

              <form className="auth-form" onSubmit={onSubmit} noValidate>
                <div className="icp-field">
                  <label htmlFor="su-name">Nom complet</label>
                  <input
                    id="su-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Prénom Nom"
                    autoComplete="name"
                    required
                  />
                </div>
                <div className={`icp-field ${errors.email ? "invalid" : ""}`}>
                  <label htmlFor="su-email">Email professionnel</label>
                  <input
                    id="su-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((s) => ({ ...s, email: undefined }));
                    }}
                    placeholder="vous@entreprise.com"
                    autoComplete="email"
                    inputMode="email"
                    required
                  />
                  {errors.email && <p className="icp-field__err">{errors.email}</p>}
                </div>
                <div className={`icp-field ${errors.password ? "invalid" : ""}`}>
                  <label htmlFor="su-pw">Mot de passe</label>
                  <input
                    id="su-pw"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((s) => ({ ...s, password: undefined }));
                    }}
                    placeholder="8 caractères minimum"
                    autoComplete="new-password"
                    required
                  />
                  {errors.password && <p className="icp-field__err">{errors.password}</p>}
                </div>
                <button className="btn btn--primary" type="submit" disabled={loading}>
                  {loading ? "Création..." : "Créer mon compte"}
                  <ArrowRightIcon />
                </button>
              </form>

              <div className="auth__divider">ou</div>

              <GoogleButton next={next} />

              <p className="auth__foot">
                Déjà un compte ? <Link href="/login">Se connecter</Link>
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
