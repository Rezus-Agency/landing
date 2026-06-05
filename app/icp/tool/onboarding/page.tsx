"use client";

/**
 * Onboarding post-création de compte.
 * Se déclenche pour tout nouveau compte (Google ou email) tant que
 * user_metadata.onboarded n'est pas true (gate dans le layout /icp/tool).
 * Enregistre les réponses dans user_metadata + passe onboarded=true.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { saveProfile } from "@/lib/icp-tool/db";
import { useToolStore } from "@/lib/icp-tool/store";
import { toast } from "@/components/icp-tool/ui/ToastProvider";
import { ArrowRightIcon } from "@/components/icp-tool/ui/icons";
import { track } from "@/lib/analytics";

const HEARD_FROM = [
  "Recherche Google",
  "ChatGPT / IA",
  "LinkedIn",
  "X (Twitter)",
  "Recommandation",
  "Newsletter",
  "Autre",
];

const COMPANY_SIZES = ["Solo", "2-10", "11-50", "51-200", "200+"];

function Chips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="onb-chips">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className="onb-chip"
          aria-pressed={value === opt}
          onClick={() => onChange(value === opt ? "" : opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const user = useToolStore((s) => s.auth);
  const firstName = (user?.name || "").trim().split(/\s+/)[0] || "";

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [website, setWebsite] = useState("");
  const [heardFrom, setHeardFrom] = useState("");
  const [heardFromOther, setHeardFromOther] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [loading, setLoading] = useState(false);

  const finish = async (skip: boolean) => {
    setLoading(true);
    const supabase = createClient();
    const heard =
      heardFrom === "Autre" ? heardFromOther.trim() || "Autre" : heardFrom;
    const data = skip
      ? { onboarded: true }
      : {
          company: company.trim() || undefined,
          role: role.trim() || undefined,
          website: website.trim() || undefined,
          heard_from: heard || undefined,
          company_size: companySize || undefined,
          onboarded: true,
        };
    const { error } = await supabase.auth.updateUser({ data });
    if (error) {
      setLoading(false);
      toast(error.message || "Une erreur est survenue.", "error");
      return;
    }
    // Miroir en DB (table profiles) pour exploitation business. Best-effort :
    // ne bloque pas l'onboarding si l'écriture échoue.
    try {
      await saveProfile(
        skip
          ? { onboarded: true }
          : {
              company: company.trim() || null,
              role: role.trim() || null,
              website: website.trim() || null,
              heard_from: heard || null,
              company_size: companySize || null,
              onboarded: true,
            },
      );
    } catch {
      // ignore
    }
    track(skip ? "ICP onboarding skipped" : "ICP onboarding completed");
    router.push("/icp/tool/dashboard");
    router.refresh();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        overflowY: "auto",
        display: "grid",
        placeItems: "center",
        padding: "48px 20px",
        background: "var(--bg)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 540 }}>
        <span className="kicker">Bienvenue{firstName ? `, ${firstName}` : ""}</span>
        <h1 style={{ fontSize: 27, fontWeight: 700, margin: "8px 0 8px", letterSpacing: "-0.01em" }}>
          Personnalisons votre espace.
        </h1>
        <p style={{ color: "var(--text-3)", lineHeight: 1.6 }}>
          Quelques infos pour adapter l&apos;outil à votre contexte. Ça prend 30 secondes.
        </p>

        <form
          className="wiz-fields"
          onSubmit={(e) => {
            e.preventDefault();
            finish(false);
          }}
        >
          <div className="icp-field">
            <label htmlFor="onb-company">Entreprise</label>
            <input
              id="onb-company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Nom de votre entreprise"
              autoComplete="organization"
              autoFocus
            />
          </div>
          <div className="icp-field">
            <label htmlFor="onb-role">Votre rôle</label>
            <input
              id="onb-role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Fondateur, Head of Sales, Marketing..."
              autoComplete="organization-title"
            />
          </div>
          <div className="icp-field">
            <label htmlFor="onb-website">Site web de l&apos;entreprise</label>
            <input
              id="onb-website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
              autoComplete="url"
              inputMode="url"
            />
          </div>

          <div style={{ marginTop: 6, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
            <span style={{ fontSize: 12, color: "var(--text-3)" }}>
              Optionnel, ça nous aide beaucoup
            </span>
          </div>

          <div className="icp-field">
            <label>Où nous avez-vous découverts ?</label>
            <Chips options={HEARD_FROM} value={heardFrom} onChange={setHeardFrom} />
            {heardFrom === "Autre" && (
              <input
                type="text"
                value={heardFromOther}
                onChange={(e) => setHeardFromOther(e.target.value)}
                placeholder="Dites-nous où"
                autoFocus
                style={{ marginTop: 10 }}
              />
            )}
          </div>

          <div className="icp-field">
            <label>Taille de l&apos;entreprise</label>
            <Chips options={COMPANY_SIZES} value={companySize} onChange={setCompanySize} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}>
            <button className="btn btn--primary" type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Terminer"}
              <ArrowRightIcon />
            </button>
            <button
              type="button"
              onClick={() => finish(true)}
              disabled={loading}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-3)",
                fontSize: 13,
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Passer pour l&apos;instant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
