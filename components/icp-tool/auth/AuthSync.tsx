"use client";

/**
 * Pont Supabase -> store Zustand.
 *
 * Monté dans le layout de /icp/tool. À l'arrivée et à chaque changement d'état
 * d'auth (login, logout, refresh token), synchronise l'utilisateur Supabase
 * dans `store.auth` pour que toute l'UI existante (Topbar, profil, initiales)
 * continue de fonctionner sans modification.
 *
 * La protection réelle des routes est faite côté serveur par le middleware ;
 * ce composant ne sert qu'à alimenter l'affichage.
 */
import { useEffect } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useToolStore } from "@/lib/icp-tool/store";
import type { User } from "@/lib/icp-tool/types";

function initialsFrom(input: string): string {
  return (input || "U")
    .split(/[\s@]+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function toUser(u: SupabaseUser): User {
  const meta = u.user_metadata ?? {};
  const name: string =
    meta.name || meta.full_name || (u.email ? u.email.split("@")[0] : "Utilisateur");
  const providers: string[] =
    (u.app_metadata?.providers as string[] | undefined) ??
    (u.app_metadata?.provider ? [u.app_metadata.provider] : []);
  return {
    name,
    email: u.email ?? "",
    company: meta.company ?? "",
    role: meta.role ?? "",
    website: meta.website ?? "",
    initials: initialsFrom(name),
    avatarUrl: meta.avatar_url || meta.picture || undefined,
    providers,
  };
}

export function AuthSync() {
  const setAuth = useToolStore((s) => s.setAuth);
  const hydrateFromDb = useToolStore((s) => s.hydrateFromDb);
  const hydrateSession = useToolStore((s) => s.hydrateSession);
  const hydrateProfile = useToolStore((s) => s.hydrateProfile);
  const clearUserData = useToolStore((s) => s.clearUserData);

  useEffect(() => {
    const supabase = createClient();

    // Au montage : on charge l'utilisateur (validé serveur) puis ses ICP + sa
    // session de chat ouverte.
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setAuth(toUser(data.user));
        hydrateFromDb();
        hydrateSession();
        hydrateProfile();
      } else {
        setAuth(null);
        clearUserData();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setAuth(toUser(session.user));
        // Re-hydrater seulement à la connexion, pas à chaque refresh de token.
        if (event === "SIGNED_IN") {
          hydrateFromDb();
          hydrateSession();
          hydrateProfile();
        }
      } else {
        setAuth(null);
        clearUserData();
      }
    });

    return () => subscription.unsubscribe();
  }, [setAuth, hydrateFromDb, hydrateSession, hydrateProfile, clearUserData]);

  return null;
}
