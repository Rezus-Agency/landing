/**
 * Store global de l'outil ICP Discovery.
 *
 * Source de vérité des ICP = Supabase (table `public.icps`, sécurisée par RLS).
 * Le store Zustand est un cache mémoire : il est hydraté depuis la DB au login
 * (cf. AuthSync) et écrit en DB en write-through (optimiste + resync sur erreur).
 *
 * Persistance localStorage (clé `rezus_icp2_v1`) limitée à `session`, `spec`,
 * `notify` (migration progressive : session -> DB en étape 3, spec en étape 4).
 * Les ICP ne sont plus persistés en localStorage (voir `partialize`).
 */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/icp-tool/ui/ToastProvider";
import {
  fetchIcps,
  saveIcp,
  deleteIcp,
  saveProfile,
  fetchProfile,
  saveSession,
  fetchOpenSession,
  deleteSession,
  deleteAllOpenSessions,
} from "./db";
import type {
  ICP,
  SessionDraft,
  ShareEntry,
  SpecDraft,
  ToolState,
  User,
} from "./types";

/** Flag localStorage : import unique des anciens ICP locaux vers la DB effectué. */
const LEGACY_IMPORT_FLAG = "rezus_icp_db_migrated";

type Actions = {
  // auth — la session est gérée par Supabase ; `auth` est synchronisé par
  // AuthSync (cf components/icp-tool/auth/AuthSync.tsx).
  isAuthed: () => boolean;
  setAuth: (user: User | null) => void;
  logout: () => Promise<void>;
  updateProfile: (p: Partial<User>) => void;
  deleteAccount: () => Promise<boolean>;

  // hydratation DB
  hydrateFromDb: () => Promise<void>;
  hydrateSession: () => Promise<void>;
  hydrateProfile: () => Promise<void>;
  clearUserData: () => void;

  // ICPs
  icpById: (id: string) => ICP | undefined;
  upsertIcp: (icp: ICP) => void;
  removeIcp: (id: string) => void;
  renameIcp: (id: string, name: string) => void;
  duplicateIcp: (id: string) => string | null;

  // session / spec
  setSession: (s: SessionDraft | null) => void;
  clearSession: () => void;
  setSpec: (s: SpecDraft | null) => void;
  clearSpec: () => void;

  // share (porté par les colonnes share_id / shared de l'ICP)
  enableShare: (icpId: string) => ShareEntry;
  disableShare: (icpId: string) => void;
  shareInfo: (icpId: string) => ShareEntry | null;

  // notify
  isNotified: (featureId: string) => boolean;
  toggleNotify: (featureId: string) => boolean;
};

const initialState: ToolState = {
  auth: null,
  icps: [],
  icpsLoaded: false,
  session: null,
  sessionLoaded: false,
  spec: null,
  notify: [],
};

// Timer module-level pour débouncer la persistance de session : le streaming
// appelle setSession des dizaines de fois par tour, on coalesce les écritures DB.
let sessionPersistTimer: ReturnType<typeof setTimeout> | null = null;

function makeInitials(input: string): string {
  return (input || "U")
    .split(/[\s@]+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export const useToolStore = create<ToolState & Actions>()(
  persist(
    (set, get) => {
      // Écrit en DB l'ICP courant (lecture fraîche du store pour éviter
      // d'écraser un champ modifié entre-temps), avec resync DB sur erreur.
      const persistIcp = (id: string) => {
        const icp = get().icpById(id);
        if (!icp) return;
        saveIcp(icp).catch(() => {
          toast("Sauvegarde impossible. Resynchronisation…", "error");
          get().hydrateFromDb();
        });
      };

      // Persistance débouncée de la session en DB (à chaque évolution, coalescée).
      const scheduleSessionPersist = () => {
        if (sessionPersistTimer) clearTimeout(sessionPersistTimer);
        sessionPersistTimer = setTimeout(() => {
          sessionPersistTimer = null;
          const s = get().session;
          if (s) saveSession(s).catch(() => {});
        }, 1200);
      };
      const cancelSessionPersist = () => {
        if (sessionPersistTimer) {
          clearTimeout(sessionPersistTimer);
          sessionPersistTimer = null;
        }
      };

      return {
        ...initialState,

        isAuthed: () => !!get().auth,

        setAuth: (user) => set({ auth: user }),

        hydrateFromDb: async () => {
          try {
            const dbIcps = await fetchIcps();
            const alreadyImported =
              typeof window !== "undefined" &&
              window.localStorage.getItem(LEGACY_IMPORT_FLAG) === "1";
            const legacy = get().icps;

            // Import unique : si la DB est vide et qu'il reste des ICP créés
            // en localStorage (avant la bascule DB), on les remonte une fois.
            if (dbIcps.length === 0 && !alreadyImported && legacy.length > 0) {
              await Promise.all(legacy.map((i) => saveIcp(i).catch(() => {})));
              if (typeof window !== "undefined") {
                window.localStorage.setItem(LEGACY_IMPORT_FLAG, "1");
              }
              const merged = await fetchIcps();
              set({ icps: merged, icpsLoaded: true });
              return;
            }

            if (typeof window !== "undefined") {
              window.localStorage.setItem(LEGACY_IMPORT_FLAG, "1");
            }
            set({ icps: dbIcps, icpsLoaded: true });
          } catch {
            // Échec réseau : on débloque l'UI sans écraser le cache existant.
            set({ icpsLoaded: true });
          }
        },

        clearUserData: () => {
          cancelSessionPersist();
          set({ icps: [], icpsLoaded: false, session: null, sessionLoaded: false });
        },

        logout: async () => {
          try {
            await createClient().auth.signOut();
          } catch {
            // ignore : on vide quand même l'état local
          }
          cancelSessionPersist();
          set({
            auth: null,
            icps: [],
            icpsLoaded: false,
            session: null,
            sessionLoaded: false,
          });
        },

        updateProfile: (p) => {
          const auth = get().auth;
          if (!auth) return;
          const next: User = { ...auth, ...p };
          if (p.name) next.initials = makeInitials(p.name);
          set({ auth: next });
          // Persiste dans les user_metadata Supabase (UI instantanée) ET dans la
          // table profiles (source queryable pour le business). Best effort.
          createClient()
            .auth.updateUser({
              data: {
                name: next.name,
                company: next.company,
                role: next.role,
                website: next.website,
              },
            })
            .catch(() => {});
          saveProfile({
            name: next.name,
            company: next.company || null,
            role: next.role || null,
            website: next.website || null,
          }).catch(() => {});
        },

        deleteAccount: async () => {
          let ok = false;
          try {
            const res = await fetch("/api/account/delete", { method: "POST" });
            ok = res.ok;
          } catch {
            ok = false;
          }
          try {
            await createClient().auth.signOut();
          } catch {
            // ignore
          }
          set({ ...initialState });
          return ok;
        },

        icpById: (id) => get().icps.find((i) => i.id === id),

        upsertIcp: (icp) => {
          const list = get().icps.slice();
          const idx = list.findIndex((x) => x.id === icp.id);
          if (idx >= 0) list[idx] = icp;
          else list.unshift(icp);
          set({ icps: list });
          persistIcp(icp.id);
        },

        removeIcp: (id) => {
          set({ icps: get().icps.filter((i) => i.id !== id) });
          deleteIcp(id).catch(() => {
            toast("Suppression impossible. Resynchronisation…", "error");
            get().hydrateFromDb();
          });
        },

        renameIcp: (id, name) => {
          const list = get().icps.slice();
          const idx = list.findIndex((x) => x.id === id);
          if (idx < 0) return;
          list[idx] = { ...list[idx], segment: name };
          set({ icps: list });
          persistIcp(id);
        },

        duplicateIcp: (id) => {
          const src = get().icps.find((i) => i.id === id);
          if (!src) return null;
          const copy: ICP = JSON.parse(JSON.stringify(src));
          copy.id = "icp_" + Date.now().toString(36);
          copy.segment = src.segment + " (copie)";
          copy.status = "draft";
          copy.createdAt = new Date().toISOString().slice(0, 10);
          // Une copie ne reprend pas le partage de l'original.
          copy.shareId = undefined;
          copy.shared = false;
          set({ icps: [copy, ...get().icps] });
          persistIcp(copy.id);
          return copy.id;
        },

        setSession: (s) => {
          set({ session: s });
          // Toute évolution de session planifie une sauvegarde DB (débouncée).
          if (s) scheduleSessionPersist();
        },
        clearSession: () => {
          cancelSessionPersist();
          const id = get().session?.id;
          set({ session: null });
          // Abandon / consommation : on supprime la session courante (quel que
          // soit son statut) ET toutes les sessions ouvertes (orphelins), pour
          // que rien ne réapparaisse et ne s'accumule.
          if (id) deleteSession(id).catch(() => {});
          deleteAllOpenSessions().catch(() => {});
        },

        hydrateSession: async () => {
          try {
            const s = await fetchOpenSession();
            set({ session: s ?? get().session, sessionLoaded: true });
          } catch {
            set({ sessionLoaded: true });
          }
        },

        hydrateProfile: async () => {
          try {
            const p = await fetchProfile();
            if (p) set({ notify: p.notify ?? [] });
          } catch {
            // ignore : on garde l'état courant
          }
        },

        setSpec: (s) => set({ spec: s }),
        clearSpec: () => set({ spec: null }),

        enableShare: (icpId) => {
          const list = get().icps.slice();
          const idx = list.findIndex((x) => x.id === icpId);
          if (idx < 0) return { shareId: "", enabled: false };
          const icp = { ...list[idx] };
          if (!icp.shareId) {
            icp.shareId = "s" + Math.random().toString(36).slice(2, 9);
          }
          icp.shared = true;
          list[idx] = icp;
          set({ icps: list });
          persistIcp(icpId);
          return { shareId: icp.shareId, enabled: true };
        },

        disableShare: (icpId) => {
          const list = get().icps.slice();
          const idx = list.findIndex((x) => x.id === icpId);
          if (idx < 0) return;
          list[idx] = { ...list[idx], shared: false };
          set({ icps: list });
          persistIcp(icpId);
        },

        shareInfo: (icpId) => {
          const icp = get().icpById(icpId);
          if (!icp || !icp.shareId) return null;
          return { shareId: icp.shareId, enabled: !!icp.shared };
        },

        isNotified: (featureId) => get().notify.includes(featureId),

        toggleNotify: (featureId) => {
          const list = get().notify.slice();
          const idx = list.indexOf(featureId);
          if (idx >= 0) list.splice(idx, 1);
          else list.push(featureId);
          set({ notify: list });
          // Persiste l'intérêt en DB (colonne profiles.notify) : sert à recontacter
          // l'utilisateur quand la feature sort. Best effort.
          saveProfile({ notify: list }).catch(() => {});
          return list.includes(featureId);
        },
      };
    },
    {
      name: "rezus_icp2_v1",
      // Bump à 7 : notify passe en DB (profiles.notify). Il ne reste que le
      // brouillon wizard (spec) en localStorage (cf. partialize).
      version: 7,
      partialize: (state) => ({
        // session -> DB (icp_sessions), notify -> DB (profiles.notify).
        // Ne reste en localStorage que le brouillon wizard (spec), en attendant
        // sa propre migration.
        spec: state.spec,
      }),
      migrate: (persisted, fromVersion) => {
        const state = (persisted || {}) as Partial<ToolState> & {
          registered?: unknown;
          shares?: unknown;
        };
        if (fromVersion < 3) {
          state.session = null;
          state.spec = null;
        }
        if (fromVersion < 4) {
          state.auth = null;
          delete state.registered;
        }
        if (fromVersion < 5) {
          // `shares` est désormais porté par les colonnes de l'ICP en DB.
          delete state.shares;
        }
        if (fromVersion < 6) {
          // La session passe en DB ; on ne la lit plus depuis localStorage.
          state.session = null;
        }
        if (fromVersion < 7) {
          // notify passe en DB (profiles.notify).
          delete (state as { notify?: unknown }).notify;
        }
        return state as ToolState;
      },
    },
  ),
);
