/**
 * Profils utilisateurs par défaut (config, pas mock).
 * - DEMO_USER : compte démo / branding équipe.
 * - GUEST_USER : profil ephemeral pour le flow "Continuer en invité".
 */
import type { User } from "./types";

export const DEMO_USER: User = {
  name: "René Marceau",
  company: "Rezus Agency",
  email: "rene@rezus.agency",
  initials: "RM",
};

export const GUEST_USER: User = {
  name: "Invité",
  email: "guest@local",
  initials: "GU",
};
