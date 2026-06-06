"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToolStore } from "@/lib/icp-tool/store";
import { confirmModal } from "@/components/icp-tool/ui/ConfirmModal";
import { toast } from "@/components/icp-tool/ui/ToastProvider";
import { LockIcon, TrashIcon } from "@/components/icp-tool/ui/icons";

// Adresse de support qui reçoit les demandes (changement d'email, etc.).
const SUPPORT_EMAIL = "support@rezus-agency.com";

export default function ProfilePage() {
  const user = useToolStore((s) => s.auth);
  const updateProfile = useToolStore((s) => s.updateProfile);
  const deleteAccount = useToolStore((s) => s.deleteAccount);
  const router = useRouter();

  const [name, setName] = useState(user?.name || "");
  const [company, setCompany] = useState(user?.company || "");
  const [role, setRole] = useState(user?.role || "");
  const [website, setWebsite] = useState(user?.website || "");

  const providers = user?.providers ?? [];
  const hasPassword = providers.includes("email");
  const isGoogle = providers.includes("google");

  // Le bouton Enregistrer reste désactivé tant que rien n'a changé.
  const dirty =
    name.trim() !== (user?.name ?? "").trim() ||
    company.trim() !== (user?.company ?? "").trim() ||
    role.trim() !== (user?.role ?? "").trim() ||
    website.trim() !== (user?.website ?? "").trim();

  const emailChangeMailto =
    `mailto:${SUPPORT_EMAIL}` +
    `?subject=${encodeURIComponent("Changement d'email de compte")}` +
    `&body=${encodeURIComponent(
      `Bonjour,\n\nJe souhaite changer l'email de mon compte.\n\nEmail actuel : ${user?.email || ""}\nNouvel email souhaité : \n\nMerci.`,
    )}`;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dirty) return;
    updateProfile({ name, company, role, website });
    toast("Profil mis à jour");
  };

  const onDelete = async () => {
    const confirmed = await confirmModal({
      title: "Supprimer définitivement votre compte ?",
      body: "Votre compte et toutes vos données seront effacés. Cette action est irréversible.",
      confirm: "Supprimer mon compte",
      danger: true,
    });
    if (!confirmed) return;
    const deleted = await deleteAccount();
    if (deleted) {
      toast("Compte supprimé.");
    } else {
      toast("Déconnecté, mais la suppression serveur a échoué. Réessayez ou contactez le support.", "error");
    }
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="main__inner" style={{ maxWidth: 720 }}>
      <div className="page-head">
        <div>
          <span className="kicker">Compte</span>
          <h1>Profil</h1>
        </div>
      </div>

      {/* Carte d'identité */}
      <div className="profile-id">
        <span className="avatar avatar--lg">
          {user?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarUrl} alt="" referrerPolicy="no-referrer" />
          ) : (
            user?.initials || "?"
          )}
        </span>
        <div style={{ minWidth: 0 }}>
          <div className="profile-id__name">{user?.name || "Votre compte"}</div>
          <div className="profile-id__mail">{user?.email}</div>
          <span className="profile-badge">
            {isGoogle ? "Connecté avec Google" : "Compte email"}
          </span>
        </div>
      </div>

      {/* Informations */}
      <form className="profile-card" onSubmit={onSubmit} noValidate>
        <h3>Informations</h3>
        <p className="profile-card__sub">Ces infos aident à personnaliser vos analyses ICP.</p>

        <div className="profile-grid">
          <div className="icp-field span-2">
            <label htmlFor="p-name">Nom complet</label>
            <input
              id="p-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
          <div className="icp-field">
            <label htmlFor="p-company">Entreprise</label>
            <input
              id="p-company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Nom de l'entreprise"
              autoComplete="organization"
            />
          </div>
          <div className="icp-field">
            <label htmlFor="p-role">Rôle</label>
            <input
              id="p-role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Fondateur, Head of Sales..."
              autoComplete="organization-title"
            />
          </div>
          <div className="icp-field span-2">
            <label htmlFor="p-website">Site web</label>
            <input
              id="p-website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
              autoComplete="url"
              inputMode="url"
            />
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <button className="btn btn--primary" type="submit" disabled={!dirty}>
            Enregistrer
          </button>
        </div>
      </form>

      {/* Email */}
      <div className="profile-card">
        <h3>Email</h3>
        <p className="profile-card__sub" style={{ marginBottom: 14 }}>
          <span className="icp-field__lock" style={{ display: "inline-flex" }}>
            <LockIcon />{" "}
            {isGoogle
              ? "Email géré par votre compte Google."
              : "L'email sert d'identifiant et ne se change pas directement ici."}
          </span>
        </p>
        <a href={emailChangeMailto} className="btn btn--secondary btn--sm">
          Demander un changement d&apos;email
        </a>
      </div>

      {/* Sécurité (uniquement pour les comptes avec mot de passe) */}
      {hasPassword && (
        <div className="profile-card">
          <h3>Mot de passe</h3>
          <p className="profile-card__sub">Changez votre mot de passe à tout moment.</p>
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => router.push("/update-password")}
          >
            Changer le mot de passe
          </button>
        </div>
      )}

      {/* Zone de danger */}
      <div className="danger-zone">
        <h3>Zone de danger</h3>
        <p>Supprime définitivement votre compte et toutes vos données. Cette action est irréversible.</p>
        <button type="button" className="btn btn--danger btn--sm" onClick={onDelete}>
          <TrashIcon /> Supprimer mon compte
        </button>
      </div>
    </div>
  );
}
