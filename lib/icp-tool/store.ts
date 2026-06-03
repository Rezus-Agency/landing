/**
 * Store global de l'outil ICP Discovery.
 * Zustand + persist (localStorage). Clé "rezus_icp2_v1" pour rester compatible
 * avec le source vanilla JS si on importait des données.
 */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ICP,
  RegisteredUser,
  SessionDraft,
  ShareEntry,
  SpecDraft,
  ToolState,
  User,
} from "./types";
import { DEMO_USER, GUEST_USER, SEED_ICPS } from "./mock-data";

type Actions = {
  // auth
  isAuthed: () => boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  signup: (d: { name?: string; email: string; password: string; company?: string }) => {
    ok: boolean;
    error?: string;
  };
  loginAsGuest: () => void;
  logout: () => void;
  updateProfile: (p: Partial<User>) => void;
  deleteAccount: () => void;

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

  // share
  enableShare: (icpId: string) => ShareEntry;
  disableShare: (icpId: string) => void;
  shareInfo: (icpId: string) => ShareEntry | null;
  icpByShareId: (shareId: string) => ICP | null;

  // notify
  isNotified: (featureId: string) => boolean;
  toggleNotify: (featureId: string) => boolean;
};

const initialRegistered: RegisteredUser[] = [
  { email: DEMO_USER.email, password: "demo", profile: { ...DEMO_USER } },
];

const initialState: ToolState = {
  auth: null,
  icps: JSON.parse(JSON.stringify(SEED_ICPS)),
  registered: initialRegistered,
  session: null,
  spec: null,
  shares: {},
  notify: [],
};

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
    (set, get) => ({
      ...initialState,

      isAuthed: () => !!get().auth,

      login: (email, password) => {
        const reg = get().registered.find(
          (u) => u.email.toLowerCase() === (email || "").toLowerCase(),
        );
        if (reg && (reg.password === password || password === "demo")) {
          set({ auth: reg.profile });
          return { ok: true };
        }
        return { ok: false, error: "Email ou mot de passe incorrect." };
      },

      signup: (d) => {
        if (!d.email || !d.password) return { ok: false, error: "Email et mot de passe requis." };
        const initials = makeInitials(d.name || d.email);
        const profile: User = {
          name: d.name || d.email.split("@")[0],
          email: d.email,
          company: d.company || "",
          initials,
        };
        const reg = get().registered;
        const exists = reg.find((u) => u.email.toLowerCase() === d.email.toLowerCase());
        if (exists) {
          exists.password = d.password;
          exists.profile = profile;
          set({ registered: [...reg], auth: profile });
        } else {
          set({
            registered: [...reg, { email: d.email, password: d.password, profile }],
            auth: profile,
          });
        }
        return { ok: true };
      },

      loginAsGuest: () => {
        set({ auth: { ...GUEST_USER } });
      },

      logout: () => set({ auth: null }),

      updateProfile: (p) => {
        const auth = get().auth;
        if (!auth) return;
        const next: User = { ...auth, ...p };
        const reg = get().registered;
        const r = reg.find((u) => u.email.toLowerCase() === auth.email.toLowerCase());
        if (r) r.profile = next;
        set({ auth: next, registered: [...reg] });
      },

      deleteAccount: () => {
        set({ ...initialState, icps: JSON.parse(JSON.stringify(SEED_ICPS)) });
      },

      icpById: (id) => get().icps.find((i) => i.id === id),

      upsertIcp: (icp) => {
        const list = get().icps.slice();
        const idx = list.findIndex((x) => x.id === icp.id);
        if (idx >= 0) list[idx] = icp;
        else list.unshift(icp);
        set({ icps: list });
      },

      removeIcp: (id) => set({ icps: get().icps.filter((i) => i.id !== id) }),

      renameIcp: (id, name) => {
        const list = get().icps.slice();
        const i = list.find((x) => x.id === id);
        if (i) {
          i.segment = name;
          set({ icps: list });
        }
      },

      duplicateIcp: (id) => {
        const src = get().icps.find((i) => i.id === id);
        if (!src) return null;
        const copy: ICP = JSON.parse(JSON.stringify(src));
        copy.id = "icp_" + Date.now().toString(36);
        copy.segment = src.segment + " (copie)";
        copy.status = "draft";
        copy.createdAt = new Date().toISOString().slice(0, 10);
        set({ icps: [copy, ...get().icps] });
        return copy.id;
      },

      setSession: (s) => set({ session: s }),
      clearSession: () => set({ session: null }),

      setSpec: (s) => set({ spec: s }),
      clearSpec: () => set({ spec: null }),

      enableShare: (icpId) => {
        const shares = { ...get().shares };
        if (!shares[icpId]) {
          shares[icpId] = {
            shareId: "s" + Math.random().toString(36).slice(2, 9),
            enabled: true,
          };
        } else {
          shares[icpId] = { ...shares[icpId], enabled: true };
        }
        set({ shares });
        return shares[icpId];
      },

      disableShare: (icpId) => {
        const shares = { ...get().shares };
        if (shares[icpId]) {
          shares[icpId] = { ...shares[icpId], enabled: false };
          set({ shares });
        }
      },

      shareInfo: (icpId) => get().shares[icpId] || null,

      icpByShareId: (shareId) => {
        const entry = Object.entries(get().shares).find(
          ([, v]) => v.shareId === shareId && v.enabled,
        );
        if (!entry) return null;
        return get().icpById(entry[0]) || null;
      },

      isNotified: (featureId) => get().notify.includes(featureId),

      toggleNotify: (featureId) => {
        const list = get().notify.slice();
        const idx = list.indexOf(featureId);
        if (idx >= 0) list.splice(idx, 1);
        else list.push(featureId);
        set({ notify: list });
        return list.includes(featureId);
      },
    }),
    {
      name: "rezus_icp2_v1",
      version: 2,
    },
  ),
);
