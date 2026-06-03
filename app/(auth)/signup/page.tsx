"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToolStore } from "@/lib/icp-tool/store";
import { BrandAside } from "@/components/icp-tool/auth/BrandAside";
import { ArrowRightIcon, BackIcon, SparkIcon } from "@/components/icp-tool/ui/icons";
import { toast } from "@/components/icp-tool/ui/ToastProvider";
import { track } from "@/lib/analytics";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function SignupPage() {
  const signup = useToolStore((s) => s.signup);
  const loginAsGuest = useToolStore((s) => s.loginAsGuest);
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!EMAIL_RE.test(email)) next.email = "Indiquez un email valide.";
    if (password.length < 4) next.password = "4 caractères minimum.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    const res = signup({ name, email, password, company });
    if (!res.ok) {
      setErrors({ email: res.error });
      return;
    }
    track("ICP tool signup");
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
            <div className="icp-field">
              <label htmlFor="su-company">
                Entreprise <span className="opt">(optionnel)</span>
              </label>
              <input
                id="su-company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Nom de l'entreprise"
                autoComplete="organization"
              />
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
                placeholder="4 caractères minimum"
                autoComplete="new-password"
                required
              />
              {errors.password && <p className="icp-field__err">{errors.password}</p>}
            </div>
            <button className="btn btn--primary" type="submit">
              Créer mon compte
              <ArrowRightIcon />
            </button>
          </form>

          <div className="auth__divider">ou</div>

          <button type="button" className="auth__guest" onClick={onGuest}>
            <SparkIcon />
            Continuer en invité
          </button>
          <p className="auth__guestNote">Mode dév · sera retiré quand Supabase est branché</p>

          <p className="auth__foot">
            Déjà un compte ? <Link href="/login">Se connecter</Link>
          </p>
        </div>
      </section>
    </>
  );
}
