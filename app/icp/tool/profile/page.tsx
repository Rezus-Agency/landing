"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToolStore } from "@/lib/icp-tool/store";
import { confirmModal } from "@/components/icp-tool/ui/ConfirmModal";
import { toast } from "@/components/icp-tool/ui/ToastProvider";
import { LockIcon, TrashIcon } from "@/components/icp-tool/ui/icons";

export default function ProfilePage() {
  const user = useToolStore((s) => s.auth);
  const updateProfile = useToolStore((s) => s.updateProfile);
  const deleteAccount = useToolStore((s) => s.deleteAccount);
  const router = useRouter();
  const [name, setName] = useState(user?.name || "");
  const [company, setCompany] = useState(user?.company || "");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, company });
    toast("Profil mis à jour");
  };

  const onDelete = async () => {
    const ok = await confirmModal({
      title: "Supprimer votre compte ?",
      body: "Tous vos ICPs seront définitivement effacés. Cette action est irréversible.",
      confirm: "Supprimer mon compte",
      danger: true,
    });
    if (ok) {
      deleteAccount();
      toast("Compte supprimé.");
      router.push("/signup");
    }
  };

  return (
    <div className="main__inner" style={{ maxWidth: 680 }}>
      <div className="page-head">
        <div>
          <span className="kicker">Compte</span>
          <h1>Profil</h1>
        </div>
      </div>

      <form className="auth-form" onSubmit={onSubmit} style={{ marginTop: 0 }} noValidate>
        <div className="icp-field">
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
            autoComplete="organization"
          />
        </div>
        <div className="icp-field">
          <label htmlFor="p-email">
            Email <span className="opt">· identifiant du compte</span>
          </label>
          <input id="p-email" type="email" value={user?.email || ""} disabled aria-readonly />
          <span className="icp-field__lock">
            <LockIcon /> Non modifiable. Contactez le support pour changer d&apos;email.
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <button className="btn btn--primary" type="submit">
            Enregistrer
          </button>
        </div>
      </form>

      <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
        <h3 style={{ fontSize: 16, fontWeight: 650, marginBottom: 6 }}>Mot de passe</h3>
        <p style={{ color: "var(--text-3)", fontSize: 14, marginBottom: 14 }}>
          Changez votre mot de passe à tout moment.
        </p>
        <button
          type="button"
          className="btn btn--secondary btn--sm"
          onClick={() => toast("Flux de changement de mot de passe à brancher.", "info")}
        >
          Changer le mot de passe
        </button>
      </div>

      <div className="danger-zone">
        <h3>Zone de danger</h3>
        <p>La suppression du compte est définitive et efface tous vos ICPs.</p>
        <button type="button" className="btn btn--danger btn--sm" onClick={onDelete}>
          <TrashIcon /> Supprimer mon compte
        </button>
      </div>
    </div>
  );
}
