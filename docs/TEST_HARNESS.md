# Harnais de test de l'outil ICP

But : tester l'UI (dashboard, résultat, partage public, panneau de session) **sans
dérouler une vraie discussion LLM** à chaque fois.

## 1. Seed des données de test

```bash
pnpm dev          # serveur sur http://localhost:3000 (dans un terminal)
pnpm icp:seed     # injecte un user de test + des ICP en base
```

`pnpm icp:seed` (script `scripts/icp-cli/seed-test-user.ts`) :
- crée/réutilise un utilisateur **déjà confirmé** : `e2e@rezus.local` / `Test1234!`
  (surchargeable via `E2E_EMAIL` / `E2E_PASSWORD`) ;
- injecte 2 ICP (le fixture `GOLDEN_ICP` complet + `THIN_ICP` minimal) ;
- marque le GOLDEN comme **partagé** avec un `share_id` stable (`stestgolden`).

Il écrit directement en base via l'Admin API + PostgREST (fetch brut, aucune
dépendance, marche sur n'importe quelle version de Node).

Sortie : identifiants + URLs prêtes à ouvrir.

## 2. URLs utiles

| Page | URL |
|---|---|
| Partage public (sans auth) | `/icp/public/stestgolden` |
| Dashboard | `/icp/tool/dashboard` |
| Résultat | `/icp/tool/result/icp_dev_golden` |
| Session (test panneau) | `/icp/tool/session/icp_dev_golden` |

## 3. Vérification automatisée (Puppeteer / Claude)

Connexion programmatique : aller sur `/login`, remplir `#lg-email` + `#lg-pw`,
cliquer `button[type="submit"]`. Le user de test étant pré-confirmé, la connexion
est immédiate (pas d'email à valider).

La page publique `/icp/public/<shareId>` ne demande aucune auth : c'est le test le
plus rapide pour vérifier la persistance DB et la policy RLS publique.

## 4. Inspection DB

Via le MCP Supabase : `list_tables`, `execute_sql` (lecture) sur `public.icps`,
`icp_sessions`, `spec_drafts`.
