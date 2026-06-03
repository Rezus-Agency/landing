"use client";

import Link from "next/link";
import { LockIcon } from "@/components/icp-tool/ui/icons";

/**
 * Stub C.1 : la page de choix mode A vs B arrive en Sprint C.2.
 * Affiche un état "Coming soon" pour ne pas avoir un 404.
 */
export default function NewSessionStubPage() {
  return (
    <div className="main__inner">
      <div className="page-head">
        <div>
          <span className="kicker">Nouvelle session</span>
          <h1>Bientôt disponible.</h1>
          <p className="page-head__sub">
            Le chatbot et le wizard arrivent au prochain sprint (C.2).
          </p>
        </div>
      </div>
      <div className="empty" style={{ marginTop: 24 }}>
        <span className="empty__icon">
          <LockIcon />
        </span>
        <h3>Sprint C.2 en cours de développement</h3>
        <p>
          Une fois prêt, vous aurez le choix entre une session chatbot scriptée et un wizard
          formulaire pour cadrer votre ICP.
        </p>
        <Link href="/icp/tool/dashboard" className="btn btn--secondary" style={{ marginTop: 16 }}>
          Retour au dashboard
        </Link>
      </div>
    </div>
  );
}
