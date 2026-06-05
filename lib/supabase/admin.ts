/**
 * Client Supabase "admin" (clé secrète / service role).
 * SERVEUR UNIQUEMENT. Donne les pleins pouvoirs (bypass RLS, admin API).
 * Ne jamais importer ce fichier dans du code client.
 */
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SECRET_KEY manquante (clé secrète serveur).");
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
