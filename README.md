# Rezus Agency : Site + ICP Discovery Tool

Site marketing (anti-positioning B2B) et outil **ICP Discovery** : une SPA conversationnelle qui
construit un Ideal Customer Profile via un agent LLM (Claude) avec recherche web temps réel.

Stack : **Next.js 16** (App Router) · React 19 · TypeScript · Tailwind v4 · shadcn ·
Zustand · **Supabase Auth** · pnpm.

## Démarrage rapide

```bash
pnpm install
cp .env.example .env.local   # puis remplis les clés (voir ci-dessous)
pnpm dev                     # http://localhost:3000
```

### Variables d'environnement
Voir `.env.example`. Tu as besoin de :
- Clés LLM / recherche : `ANTHROPIC_API_KEY`, `LINKUP_API_KEY`, `TAVILY_API_KEY`, `OPENAI_API_KEY`
- Supabase : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`
  (nouveau nommage des clés ; `anon` / `service_role` sont les anciens noms legacy)

## Authentification

L'auth (email + mot de passe avec confirmation, **et** Google OAuth) est branchée sur Supabase.
Routes protégées : `/icp/tool/*` et `/api/icp/*` (via `proxy.ts`, côté serveur).

👉 **Setup pas-à-pas (projet Supabase, Google OAuth, templates email, MCP) :
[`docs/SETUP_AUTH.md`](docs/SETUP_AUTH.md)**

## Adresses email

Convention par usage (domaine `rezus-agency.com`) :

| Adresse | Usage | Statut |
|---|---|---|
| `contact@rezus-agency.com` | Contact général / commercial / légal : formulaire de contact, mentions légales, politique de confidentialité, footer, schema SEO | utilisée dans le code |
| `support@rezus-agency.com` | Support in-app (profil, changement d'email, aide compte) | utilisée dans le code |
| `noreply@rezus-agency.com` | **Expéditeur** des emails automatiques : confirmation d'inscription & reset password (Sender SMTP Supabase), futurs emails "feature dispo" (notify) | à créer |

Recommandées (conformité + délivrabilité), pas encore branchées :
- `privacy@rezus-agency.com` (ou `dpo@`) : demandes RGPD (accès / suppression de données). La
  politique de confidentialité pointe pour l'instant vers `contact@` ; à basculer si l'adresse est créée.
- `postmaster@` et `abuse@` (simples alias) : standards email recommandés quand on envoie via SMTP
  custom, bons pour la réputation/délivrabilité du domaine.

> Les features qui dépendent de l'envoi d'email (contact, confirmation signup, reset, notify) sont
> bloquées tant que le SMTP custom n'est pas configuré. Détails : [`docs/EMAIL_BLOCKED_FEATURES.md`](docs/EMAIL_BLOCKED_FEATURES.md)
> et setup SMTP : [`docs/TODO_EMAIL_AUTH.md`](docs/TODO_EMAIL_AUTH.md).

## Structure

| Chemin | Rôle |
|---|---|
| `app/` (pages marketing) | `/`, `/icp`, `/methode`, `/contact`, pages légales : **publiques** |
| `app/icp/tool/*` | SPA de l'outil ICP : **protégée** |
| `app/(auth)/*` | Pages login / signup / reset / update-password |
| `app/auth/*` | Routes d'échange OAuth & confirmation email |
| `app/api/icp/*` | Endpoints chat (SSE → agent LLM) & transcription : **protégés** |
| `lib/llm-core/*` | Orchestrateur agent, prompts, outils |
| `lib/supabase/*` | Clients Supabase + helper middleware |
| `lib/icp-tool/*` | Store Zustand, types, export Clay, etc. |

## Scripts utiles

```bash
pnpm dev            # serveur de dev
pnpm build          # build de prod
pnpm lint           # eslint
pnpm format         # prettier --write
pnpm icp:smoke      # smoke test CLI de l'agent ICP
```
