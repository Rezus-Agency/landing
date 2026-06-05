/**
 * Client Supabase pour les composants côté navigateur ("use client").
 * À utiliser dans les hooks/composants React qui tournent dans le browser.
 */
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // Clé publishable (nouveau système). Fallback vers anon (legacy) si besoin.
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
  );
}
