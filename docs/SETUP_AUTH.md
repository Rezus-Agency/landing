# Setup : Authentification Supabase

Ce guide liste **tout ce que tu dois faire à la main** (dashboard Supabase, Google Cloud) pour
activer l'authentification. Le code (clients, middleware, pages login/signup/reset, routes
`/auth/*`, protection des routes API) est déjà en place dans le repo.

Méthodes activées : **email + mot de passe** (avec confirmation email obligatoire) **et
Google OAuth**.

---

## 1. Créer le projet Supabase

1. Va sur https://supabase.com/dashboard → **New project**.
2. Note le mot de passe de la base (tu n'en as pas besoin pour l'auth, mais garde-le).
3. Une fois le projet créé : **Settings > API Keys**. Récupère (Supabase utilise
   désormais les clés « Publishable » / « Secret » ; les anciennes `anon` / `service_role`
   sont marquées **legacy**) :
   - **Project URL** (Settings > API) : `NEXT_PUBLIC_SUPABASE_URL`
   - **Publishable key** (`sb_publishable_...`) : `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - **Secret key** (`sb_secret_...`) : `SUPABASE_SECRET_KEY` (serveur uniquement)
   - **Reference ID** (dans l'URL du projet ou Settings > General) : utile pour le MCP.

4. Copie `.env.example` en `.env.local` et remplis les variables Supabase :

   ```bash
   cp .env.example .env.local
   # puis édite .env.local
   ```

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   SUPABASE_SECRET_KEY=sb_secret_...
   ```

   (Garde aussi les clés LLM existantes : `ANTHROPIC_API_KEY`, `LINKUP_API_KEY`, `TAVILY_API_KEY`,
   `OPENAI_API_KEY`.)

---

## 2. Configurer l'authentification

Dans le dashboard Supabase → **Authentication**.

### 2.1 Email / mot de passe
- **Providers → Email** : activé (par défaut).
- **Confirm email** : **activé** (un utilisateur doit cliquer le lien reçu avant d'accéder à l'outil).

### 2.2 URLs de redirection (dev + prod en une fois)
**Authentication > URL Configuration** :
- **Site URL** : `https://www.rezus-agency.com` (le domaine de prod, en HTTPS).
  C'est l'URL de repli ; nos pages passent de toute façon l'URL courante, donc le dev
  sur localhost marche aussi grâce à l'allowlist ci-dessous.
- **Redirect URLs** (Add URL), ajoute ces patterns (les `/**` couvrent `/auth/callback`,
  `/auth/confirm`, `/update-password`) :
  ```
  http://localhost:3000/**
  https://www.rezus-agency.com/**
  https://rezus-agency.com/**
  ```
  (La 3e ligne couvre le domaine sans `www` au cas où.)

### 2.3 Templates d'email (important, et compatible dev + prod)
Par défaut le lien de confirmation ne passe pas par notre route `/auth/confirm`.
Va dans **Authentication > Emails > Templates** et adapte les liens.

On utilise `{{ .RedirectTo }}` (et non `{{ .SiteURL }}`) : ainsi le lien pointe vers
**l'environnement où l'utilisateur s'est inscrit** (localhost en dev, ton domaine en prod),
sans avoir à maintenir deux templates.

- **Confirm signup** : remplace le lien (`<a href="...">`) par
  ```
  {{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=email
  ```
- **Reset password** :
  ```
  {{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=recovery
  ```

> Pourquoi ça marche : nos pages signup/reset appellent Supabase avec
> `emailRedirectTo = <origine courante>/auth/confirm?next=...`. Cette valeur devient
> `{{ .RedirectTo }}`, à laquelle le template ajoute le `token_hash`. Notre route
> `/auth/confirm` vérifie l'OTP puis redirige vers `next`.
>
> Flow de reset : email > `/auth/confirm` (pose la session) > `/update-password`.

---

## 3. Google OAuth

### 3.1 Côté Google Cloud (Google Auth Platform)
1. https://console.cloud.google.com : crée (ou choisis) un projet.
2. **Google Auth Platform > Overview** (https://console.cloud.google.com/auth/overview) :
   si pas configuré, **Get Started**. App name `Rezus Agency`, support email, **Audience = External**.
3. **Google Auth Platform > Audience** : section **Test users** > **Add users** > ajoute ton
   Gmail de test (obligatoire tant que l'app est en « Testing »).
4. **Google Auth Platform > Clients** > **Create client** :
   - Type : **Web application**.
   - **Authorized JavaScript origins** (les deux environnements) :
     ```
     http://localhost:3000
     https://www.rezus-agency.com
     ```
   - **Authorized redirect URIs** : **uniquement** la callback Supabase (le flux OAuth passe
     toujours par Supabase, jamais directement par ton app, donc une seule URL ici, valable
     dev ET prod) :
     ```
     https://<TON_REFERENCE_ID>.supabase.co/auth/v1/callback
     ```
   - **Create**, puis récupère **Client ID** (`...apps.googleusercontent.com`) et **Client secret** (`GOCSPX-...`).

### 3.2 Côté Supabase
- **Authentication > Sign In / Providers > Google** : active, colle le **Client ID** dans
  « Client IDs » et le **Client secret**, puis **Save**.

Le bouton « Continuer avec Google » des pages login/signup utilisera ensuite
`/auth/callback` automatiquement, en dev comme en prod.

> Passage en prod : quand le site est en ligne, repasse l'app Google de « Testing » à
> « Published » (Audience) pour que n'importe qui puisse se connecter, pas seulement les test users.

---

## 4. Vérifier en local

```bash
pnpm install
pnpm dev
```

1. Fenêtre privée > va direct sur `http://localhost:3000/icp/tool/dashboard` >
   tu dois être **redirigé vers `/login`** (protection serveur via `proxy.ts`).
2. Crée un compte (`/signup`) > tu reçois un email > clic > tu arrives sur le dashboard.
3. Teste Google sur `/login`.
4. Déconnexion (menu sidebar) > retour login ; re-accès direct au tool > redirige.

---

## 4bis. Mise en production (rien d'autre à reconfigurer côté Supabase/Google)

Grâce à la config dev + prod faite plus haut, il ne reste qu'à **déclarer les mêmes variables
d'environnement sur ton hébergeur** (Vercel, etc.) :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- (+ tes clés LLM : `ANTHROPIC_API_KEY`, `LINKUP_API_KEY`, `TAVILY_API_KEY`, `OPENAI_API_KEY`)

Sur **Vercel** : Project > Settings > Environment Variables, ajoute-les pour l'environnement
**Production** (et Preview si tu veux). Redeploie.

Checklist prod :
- [ ] Domaine servi en **HTTPS** sur `https://www.rezus-agency.com` (les cookies de session sont `Secure`).
- [ ] `https://www.rezus-agency.com/**` est bien dans les **Redirect URLs** Supabase (fait en 2.2).
- [ ] L'app Google est passée en **Published** (sinon seuls les test users peuvent se connecter).
- [ ] Variables d'env définies sur l'hébergeur.

---

## 5. MCP Supabase (pour piloter la DB depuis Claude Code)

Permet à Claude d'agir sur ta base (lecture des tables, exécution de migrations, etc.).
On commence en **lecture seule** (`--read-only`) ; on retirera le flag quand on attaquera les
migrations de la phase suivante.

### 5.1 Créer un Personal Access Token
- Supabase → **Account → Access Tokens** (https://supabase.com/dashboard/account/tokens) →
  **Generate new token** → copie-le (tu ne le reverras plus).

### 5.2 Configurer le serveur MCP
Le repo contient `.mcp.json.example`. Copie-le et remplis-le :

```bash
cp .mcp.json.example .mcp.json
```

`.mcp.json` est **gitignored** (il contient un secret). Édite-le :

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=<TON_REFERENCE_ID>"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "<TON_PERSONAL_ACCESS_TOKEN>"
      }
    }
  }
}
```

> Alternative en une commande :
> ```bash
> claude mcp add supabase -- npx -y @supabase/mcp-server-supabase@latest \
>   --read-only --project-ref=<TON_REFERENCE_ID>
> ```
> (puis ajoute `SUPABASE_ACCESS_TOKEN` dans la config du serveur).

### 5.3 Activer
Relance Claude Code (ou `/mcp` pour vérifier la connexion). Une fois connecté, je peux interroger
la base. Pour me laisser **écrire** (migrations), retire `--read-only` et préviens-moi.

---

## Récapitulatif des fichiers d'auth (déjà codés)

| Fichier | Rôle |
|---|---|
| `lib/supabase/client.ts` / `server.ts` | Clients Supabase browser / serveur |
| `lib/supabase/middleware.ts` + `proxy.ts` | Refresh session + protection `/icp/tool/*` et `/api/icp/*` |
| `app/auth/callback/route.ts` | Retour OAuth (Google) |
| `app/auth/confirm/route.ts` | Confirmation email + reset (verifyOtp) |
| `app/(auth)/login|signup|reset|update-password` | UI d'auth |
| `components/icp-tool/auth/AuthSync.tsx` | Sync session Supabase → store Zustand |
| `components/icp-tool/auth/GoogleButton.tsx` | Bouton Google OAuth |
