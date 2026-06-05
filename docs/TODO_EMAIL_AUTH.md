# TODO : Faire marcher les emails d'auth (confirmation + reset)

> Diagnostic : le code, les templates et la route `/auth/confirm` marchent déjà
> (vérifié dans les logs Supabase). Le seul blocage est le **service email par
> défaut de Supabase** qui n'envoie qu'aux membres du projet et est limité à
> ~2 emails/heure. Solution : brancher un SMTP custom. Une seule config, valable
> dev ET prod (c'est Supabase qui envoie dans les deux cas).

## Étapes (à faire quand tu veux)

### 1. Compte Resend
- [ ] Créer un compte sur https://resend.com
- [ ] Ajouter le domaine `rezus-agency.com` dans Resend
- [ ] Coller chez le registrar les enregistrements DNS (DKIM/SPF) fournis par Resend
- [ ] Attendre la vérification du domaine (statut "Verified")
- [ ] Créer une API Key Resend (la copier)

> Astuce : pour tester avant que le DNS soit validé, tu peux envoyer depuis
> `onboarding@resend.dev`.

### 2. Brancher dans Supabase
Dashboard Supabase > Authentication > Emails > SMTP Settings > Enable Custom SMTP :
- [ ] Host : `smtp.resend.com`
- [ ] Port : `465`
- [ ] Username : `resend`
- [ ] Password : la clé API Resend
- [ ] Sender email : `noreply@rezus-agency.com` (sur le domaine vérifié)
- [ ] Sender name : `Rezus Agency`
- [ ] Save

### 3. Rate limit
- [ ] Authentication > Rate Limits : monter la limite d'emails (défaut 30 users/h avec SMTP custom)

### 4. Vérifier
- [ ] Inscription avec une adresse qui N'EST PAS membre du projet > email reçu
- [ ] Reset password avec la même adresse > email reçu
- [ ] Tester en local (localhost:3000) ET en prod (www.rezus-agency.com)

## Notes
- Rien à changer dans le code ni dans `.env.local` : l'envoi se règle 100% côté Supabase.
- Templates email déjà OK (ne pas y toucher).
- Alternatives à Resend si besoin : Brevo, Mailgun, ou SMTP Google Workspace.
