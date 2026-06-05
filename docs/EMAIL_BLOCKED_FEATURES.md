# Features bloquées par l'absence d'email pro / SMTP

Plusieurs features dépendent d'un **email d'entreprise + SMTP custom** (cf.
`docs/TODO_EMAIL_AUTH.md` pour la mise en place SMTP, prérequis commun à tout ça).
Tant que ce n'est pas en place, elles ne sont **pas pleinement fonctionnelles**.
Ce document les liste pour ne rien oublier et les finir le moment venu.

> Volontairement **pas** de capture en DB pour ces features (pas de tables
> "fourre-tout"). On branchera l'email directement quand il sera prêt.

---

## 1. Formulaire de contact (page /contact) — IMPACT FORT (perte de leads)
- **État actuel** : le formulaire affiche "Message envoyé" mais **n'envoie rien**.
  Le message est perdu (seul un event analytics `Contact form submitted` part).
  Fichier : `components/effects/ContactForm.tsx`.
- **À faire quand l'email est prêt** : créer une route `POST /api/contact` qui envoie
  le message à `hello@rezus.agency` (via le SMTP / Resend). Brancher le `onSubmit`
  du form dessus (remplacer le `setSubmitted(true)` direct par un appel API + gestion
  d'erreur). Accusé de réception optionnel à l'expéditeur.
- Alternative de secours : `mailto:` (déjà présent en lien sur la page).

## 2. Confirmation d'email à l'inscription — IMPACT FORT (signup email cassé)
- **État actuel** : le code est prêt (`/auth/confirm`, templates), mais le service
  email par défaut de Supabase n'envoie qu'aux adresses pré-autorisées et est
  rate-limité. Donc un vrai prospect qui s'inscrit ne reçoit pas l'email.
- **À faire** : configurer le SMTP custom (cf. `docs/TODO_EMAIL_AUTH.md`). Aucune
  modif de code nécessaire ensuite.

## 3. Réinitialisation de mot de passe — IMPACT MOYEN
- **État actuel** : flux codé et complet (`/reset` → email → `/auth/confirm` →
  `/update-password`). Bloqué uniquement par l'envoi d'email (même cause que #2).
- **À faire** : SMTP custom (cf. `docs/TODO_EMAIL_AUTH.md`). Rien d'autre.

## 4. Emails de notification "préviens-moi" (features à venir) — IMPACT FAIBLE
- **État actuel** : l'intérêt des utilisateurs **est déjà capturé en DB**
  (`profiles.notify`, fait). Ce qui manque, c'est **l'envoi** de l'email quand la
  feature sort.
- **À faire quand l'email est prêt** : un job/route qui, au lancement d'une feature,
  récupère les users avec la feature dans `profiles.notify` et leur envoie un email.
  (La donnée est prête, il ne reste que l'envoi.)

---

## Récapitulatif

| Feature | Code prêt ? | Donnée captée ? | Manque |
|---|---|---|---|
| Contact form | non (à wirer) | non (volontaire) | route + envoi email |
| Confirmation signup | oui | n/a | SMTP custom |
| Reset password | oui | n/a | SMTP custom |
| Notify au lancement | partiel | **oui** (`profiles.notify`) | envoi email |

**Prérequis commun : SMTP custom** (Resend conseillé). Voir `docs/TODO_EMAIL_AUTH.md`.
Une fois l'email pro + SMTP en place, ces 4 points se finissent vite.
