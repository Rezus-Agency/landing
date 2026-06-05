# Diagnostic approfondi : état de la persistance DB de l'outil ICP

Date : 2026-06-05. Projet Supabase unique `dhcuvkftgrtmfworknji` (dev + prod).

Méthode : inventaire exhaustif de **tout l'état applicatif** (grep `localStorage`,
`user_metadata`, `persist(`, écritures Supabase) et de son lieu de stockage réel.

## Légende statut
- ✅ **En DB** : source de vérité Supabase, cross-appareil, survit au vidage de cache.
- 🟡 **user_metadata** : stocké côté serveur dans l'auth Supabase (cross-appareil) mais
  pas dans une table métier. Acceptable, pas une table à migrer.
- ❌ **localStorage** : navigateur uniquement. Perdu au changement d'appareil / vidage cache.

---

## 1. Inventaire complet de l'état

| # | Donnée | Où c'est stocké aujourd'hui | Statut | Cross-appareil | Impact si pas en DB |
|---|--------|------------------------------|--------|----------------|---------------------|
| 1 | **ICP finalisés** (`icps[]`) | table `public.icps` | ✅ | oui | — (fait) |
| 2 | **Partages publics** (`share_id`/`shared`) | colonnes de `public.icps` | ✅ | oui | — (fait, bug cross-navigateur corrigé) |
| 3 | **Profil** (nom, société, rôle, site, avatar, providers) | `auth.users.user_metadata` | 🟡 | oui | aucun (déjà serveur) |
| 4 | **Onboarding** (`onboarded`, `company_size`, `heard_from`) | `auth.users.user_metadata` | 🟡 | oui | aucun (déjà serveur) |
| 5 | **Session de chat en cours** (`session` = SessionDraft) | localStorage `rezus_icp2_v1` | ❌ | **non** | reprise impossible sur un autre appareil ; perdue au vidage cache ; bandeau "Sauvegardé" mensonger |
| 6 | **Brouillon wizard** (`spec` = SpecDraft) | localStorage `rezus_icp2_v1` | ❌ | **non** | brouillon perdu cross-appareil ; **+ le wizard semble cassé** (à réparer) |
| 7 | **Flags de notification features** (`notify[]`) | localStorage `rezus_icp2_v1` | ❌ | non | mineur (préférences "préviens-moi" non suivies entre appareils) |
| 8 | Flag d'import unique (`rezus_icp_db_migrated`) | localStorage | ❌ (volontaire) | non | aucun (marqueur technique local, doit rester local) |

Tables déjà créées **mais pas encore branchées** : `public.icp_sessions` (pour #5),
`public.spec_drafts` (pour #6). Le schéma et les policies RLS existent déjà (migration 0001).

---

## 2. Ce qui est déjà connecté (rappel)

- **ICP + partages** : couche `lib/icp-tool/db.ts`, store en write-through optimiste,
  hydratation au login (`AuthSync`), page publique en Server Component. Vérifié de bout en
  bout (création via chat → DB → reload → partage cross-navigateur).
- **Suppression de compte** : `/api/account/delete` supprime l'utilisateur ; les FK
  `on delete cascade` effacent **automatiquement** ses `icps` / `icp_sessions` / `spec_drafts`.
  Donc pas de données orphelines. ✅
- **Routes API** (`/api/icp/chat`, `/transcribe`) : sans état **par design** (le LLM tourne,
  le client persiste). Ce n'est pas un manque, c'est l'archi retenue.

---

## 3. Ce qu'il reste à connecter (par priorité)

### Priorité 1 — Sessions de chat en cours → `icp_sessions` (= Étape 3)
- **Pourquoi** : c'est le seul vrai trou fonctionnel. Aujourd'hui la reprise ("Reprendre
  plus tard", carte du dashboard) ne marche que sur le même navigateur. Le bandeau
  "Sauvegardé" laisse croire à une sauvegarde cloud qui n'existe pas.
- **Quoi** : `saveSession/fetchOpenSession/deleteSession` dans `db.ts` ; write-through dans
  `useChatStream` **à la fin de chaque tour** (sur `done`/fin de stream), pas à chaque delta
  de texte (sinon des dizaines d'écritures/tour). `clearSession` → delete. Hydrater la
  session ouverte (`final = false`) au login.
- **Points d'attention** :
  - `SessionDraft` est volumineux (messages format Anthropic + log UI + panel + sources).
    Stockable en `jsonb` sans souci, mais **dédupliquer log/messages** : ne pas stocker deux
    fois la même info si évitable (acceptable en v1).
  - Débounce + écriture en fin de tour pour ne pas spammer la DB pendant le streaming.
  - Une seule session ouverte par user à la fois (la dernière `final = false`).
- **Effort** : moyen. **Risque** : faible (table + policies déjà prêtes).

### Priorité 2 — Réparer puis persister le wizard → `spec_drafts` (= Étape 4)
- **Pourquoi** : l'utilisateur signale que le wizard "j'ai déjà mon ICP" ne marche pas. À
  **diagnostiquer/réparer d'abord** (`app/icp/tool/new/spec/page.tsx` : génération d'ICP à
  partir du formulaire, mapping vers le type ICP), **puis** persister le brouillon.
- **Quoi** : `spec_drafts` (1 ligne/user), `setSpec` write-through debouncé, hydratation au
  login, nettoyage à la soumission.
- **Effort** : moyen (réparation incluse). **Risque** : moyen (bug fonctionnel à trouver).

### Priorité 3 — Préférences `notify[]` → `user_metadata` (= Étape 5, mineur)
- **Pourquoi** : faible enjeu. Les flags "préviens-moi" sur les features à venir.
- **Quoi** : déplacer dans `user_metadata` (pas besoin d'une table), puis **retirer la
  dernière dépendance à `persist` localStorage** dans le store.
- **Effort** : faible. **Risque** : faible.

---

## 4. Durcissement à faire avant prod (sécurité)

- **Grants** : corrigé (migration 0002). Bug réel trouvé : les tables créées via le MCP
  n'héritaient pas des privilèges par défaut → toute écriture navigateur aurait échoué.
- **`auth_leaked_password_protection`** : désactivé. À activer (Auth settings) avant prod.
- **`rls_auto_enable()`** : fonction SECURITY DEFINER exécutable par anon/authenticated
  (advisor). Pré-existante. À revoir (revoke execute / SECURITY INVOKER).
- **Types générés** : régénérer `lib/supabase/types.ts` (`generate_typescript_types`) et
  typer `db.ts` pour fiabiliser les requêtes.
- Relancer `get_advisors security` après chaque migration.

---

## 5. Verdict

L'ossature DB est saine et la partie à plus forte valeur (ICP + partages) est connectée,
testée et sans bug connu. **Un seul vrai trou fonctionnel reste : les sessions de chat
(Priorité 1).** Le wizard est une réparation + branchement (Priorité 2). Le reste est
cosmétique (notify) ou du durcissement prod (sécurité). Les tables des priorités 1 et 2
existent déjà : il ne reste que le code applicatif + les tests.

Ordre recommandé : **Étape 3 (sessions) → Étape 4 (wizard) → Étape 5 (notify + sécurité)**.
