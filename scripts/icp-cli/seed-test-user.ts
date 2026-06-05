/**
 * Harnais de test : provisionne un utilisateur de test (email/password, déjà
 * confirmé) et lui injecte des données ICP directement en base. Permet de tester
 * l'UI (dashboard, résultat, partage public, panneau de session) sans jamais
 * avoir à dérouler une vraie discussion LLM.
 *
 * Implémentation en `fetch` brut (Admin API GoTrue + PostgREST) : pas de
 * dépendance supabase-js, fonctionne sur n'importe quelle version de Node.
 *
 * Lancement :  pnpm icp:seed
 */
import { icpToRow } from "../../lib/icp-tool/icp-map";
import { GOLDEN_ICP, THIN_ICP } from "../../lib/icp-tool/fixtures";
import type { ICP } from "../../lib/icp-tool/types";

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SECRET = (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY)!;
const TEST_EMAIL = process.env.E2E_EMAIL || "e2e@rezus.local";
const TEST_PASSWORD = process.env.E2E_PASSWORD || "Test1234!";
const SHARE_ID = "stestgolden"; // share_id stable pour tester la page publique

if (!URL_BASE || !SECRET) {
  console.error("NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SECRET_KEY manquant (lancer via pnpm icp:seed).");
  process.exit(1);
}

const adminHeaders = {
  apikey: SECRET,
  Authorization: `Bearer ${SECRET}`,
  "Content-Type": "application/json",
};

async function findUserId(email: string): Promise<string | null> {
  for (let page = 1; page <= 20; page++) {
    const res = await fetch(`${URL_BASE}/auth/v1/admin/users?page=${page}&per_page=200`, {
      headers: adminHeaders,
    });
    if (!res.ok) throw new Error(`listUsers ${res.status}: ${await res.text()}`);
    const body = (await res.json()) as { users: { id: string; email?: string }[] };
    const found = body.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (found) return found.id;
    if (body.users.length < 200) break;
  }
  return null;
}

async function main() {
  // 1. Utilisateur de test (créé déjà confirmé, ou réutilisé/mis à jour).
  const meta = { name: "Test E2E", onboarded: true };
  let userId = await findUserId(TEST_EMAIL);
  if (!userId) {
    const res = await fetch(`${URL_BASE}/auth/v1/admin/users`, {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        email_confirm: true,
        user_metadata: meta,
      }),
    });
    if (!res.ok) throw new Error(`createUser ${res.status}: ${await res.text()}`);
    userId = ((await res.json()) as { id: string }).id;
    console.log(`✓ Utilisateur de test créé : ${TEST_EMAIL}`);
  } else {
    const res = await fetch(`${URL_BASE}/auth/v1/admin/users/${userId}`, {
      method: "PUT",
      headers: adminHeaders,
      body: JSON.stringify({ password: TEST_PASSWORD, user_metadata: meta }),
    });
    if (!res.ok) throw new Error(`updateUser ${res.status}: ${await res.text()}`);
    console.log(`✓ Utilisateur de test réutilisé : ${TEST_EMAIL}`);
  }

  // 2. ICP de test (upsert). GOLDEN partagé pour tester la page publique.
  const golden: ICP = { ...GOLDEN_ICP, shareId: SHARE_ID, shared: true };
  const rows = [icpToRow(golden, userId), icpToRow(THIN_ICP, userId)];
  const res = await fetch(`${URL_BASE}/rest/v1/icps`, {
    method: "POST",
    headers: { ...adminHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(rows),
  });
  if (!res.ok) throw new Error(`upsert icps ${res.status}: ${await res.text()}`);
  console.log(`✓ ${rows.length} ICP injectés (dont 1 partagé)`);

  // 3. Récap.
  const base = process.env.BASE_URL || "http://localhost:3000";
  console.log("\n--- Prêt pour les tests ---");
  console.log(`Login    : ${TEST_EMAIL} / ${TEST_PASSWORD}`);
  console.log(`Dashboard: ${base}/icp/tool/dashboard`);
  console.log(`Résultat : ${base}/icp/tool/result/${GOLDEN_ICP.id}`);
  console.log(`Session  : ${base}/icp/tool/session/${GOLDEN_ICP.id}  (test panneau)`);
  console.log(`Partage  : ${base}/icp/public/${SHARE_ID}  (sans auth)`);
}

main().catch((e) => {
  console.error("Seed échoué :", e);
  process.exit(1);
});
