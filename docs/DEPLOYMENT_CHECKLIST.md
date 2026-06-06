# Checklist de déploiement & TODO restants

État : le code est prêt (build prod OK, typecheck OK, secrets non commités, DB
nettoyée, sécurité durcie). Il reste de la **config de déploiement** et quelques
features dépendantes de l'email. Ce document liste tout ce qui reste.

---

## 1. À FAIRE avant / pendant le déploiement (bloquant)

### Vercel — variables d'environnement
À définir pour **Production** (et Preview) avant le premier déploiement, sinon crash :
- [ ] `ANTHROPIC_API_KEY`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- [ ] `SUPABASE_SECRET_KEY`
- [ ] `OPENAI_API_KEY` (dictée vocale du chat)
- [ ] `LINKUP_API_KEY` (recherche web primaire)
- [ ] `TAVILY_API_KEY` (recherche web fallback)

### Supabase — configuration
- [ ] **Activer "Leaked password protection"** (Authentication → Passwords). Seul
      advisor de sécurité restant.
- [ ] **URL Configuration** : Site URL = `https://www.rezus-agency.com` ; Redirect
      URLs incluent `https://www.rezus-agency.com/**` et `https://rezus-agency.com/**`
      (cf `docs/SETUP_AUTH.md`). Sinon Google OAuth + liens email cassés.
- [ ] **Google OAuth** : passer l'app de "Testing" à **"Published"** (sinon seuls
      les test users peuvent se connecter).

### Domaine
- [ ] `www.rezus-agency.com` servi en **HTTPS** (cookies de session `Secure`).

---

## 2. Emails — bloqués tant que le SMTP n'est pas configuré

Détails complets : `docs/TODO_EMAIL_AUTH.md` (setup SMTP) et
`docs/EMAIL_BLOCKED_FEATURES.md`.

- [ ] **Configurer un SMTP custom** (Resend conseillé) dans Supabase. Sans ça :
  - confirmation d'inscription par email **ne part pas** aux vrais prospects,
  - reset de mot de passe **ne marche pas**.
  - 👉 **Google OAuth fonctionne sans email** (voie de connexion recommandée au lancement).
- [ ] **Formulaire de contact** : actuellement il affiche "Message envoyé" mais
      n'envoie rien. À brancher (route `POST /api/contact` → `contact@rezus-agency.com`)
      une fois l'email prêt.
- [ ] **Emails "préviens-moi" (notify)** : l'intérêt est capté en DB
      (`profiles.notify`) ; il restera à envoyer l'email au lancement d'une feature.

### Adresses email à créer
- [ ] `contact@rezus-agency.com` (déjà câblé dans le code)
- [ ] `support@rezus-agency.com` (déjà câblé dans le code)
- [ ] `noreply@rezus-agency.com` (expéditeur des emails auto / Sender SMTP)
- [ ] (recommandé) `privacy@`/`dpo@` (RGPD), alias `postmaster@` + `abuse@` (délivrabilité)

---

## 3. SEO / divers
- [ ] Remplir `GSC_VERIFICATION` dans `lib/seo.ts` avec le vrai token Google Search
      Console (en attendant, aucune balise n'est émise — c'est OK).
- [ ] (admin Xolo/registre) mettre l'email officiel à jour vers `contact@rezus-agency.com`
      le moment venu (actuellement `contact@renemarceau.com`).
- [ ] Confirmer la région Supabase déjà notée dans la politique de confidentialité
      (Francfort / UE — fait).

---

## 4. Non bloquant (à faire plus tard si on veut)
- [ ] **CGU / Conditions d'utilisation** de l'outil ICP (page `/conditions-utilisation`).
      Recommandé pour un SaaS, pas imposé.
- [ ] **Lint** : 6 erreurs `react-hooks/set-state-in-effect` pré-existantes (pattern
      `setHydrated(true)` au montage). Ne bloquent pas `next build` / Vercel. À nettoyer.
- [ ] **Wizard** : instabilité résiduelle possible (génération dépend du LLM) ; surveiller.
- [ ] **Base dev/prod** : un seul projet Supabase sert les deux. Envisager un projet
      prod séparé plus tard (les tests locaux écrivent dans la même base).

---

## 5. Vérifications post-déploiement
- [ ] Inscription via **Google** → arrive sur l'onboarding puis le dashboard.
- [ ] Création d'un ICP (chat) → visible après reload (persistance DB).
- [ ] Lien de partage public ouvert en navigation privée → l'ICP s'affiche ; désactivation → "Lien indisponible".
- [ ] Page `/contact` : le calendrier Calendly s'affiche (chargement direct ET navigation interne).
- [ ] `get_advisors security` Supabase : seul "leaked password" doit rester (puis 0 après activation).
