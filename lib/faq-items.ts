export type FAQItem = {
  q: string;
  a: string;
};

export const HOMEPAGE_FAQ: FAQItem[] = [
  {
    q: "En quoi c'est différent d'une agence outbound classique ?",
    a: "On ne joue pas au volume. On cible quelques centaines de comptes pertinents, on écrit chaque message à la main, et on optimise sur les rendez-vous qualifiés plutôt que sur des taux d'ouverture. C'est l'inverse exact du modèle « spray & pray ».",
  },
  {
    q: "Vous allez cramer mon domaine ?",
    a: "Jamais. On utilise des domaines secondaires dédiés, avec un warmup progressif et une authentification complète (SPF, DKIM, DMARC). Votre domaine principal reste protégé et votre délivrabilité préservée.",
  },
  {
    q: "Combien de temps avant les premiers résultats ?",
    a: "Les premières semaines servent au cadrage, au ciblage et au warmup de l'infrastructure. Les premières conversations qualifiées arrivent généralement entre la 4e et la 8e semaine. On préfère des objectifs réalistes à des promesses intenables.",
  },
  {
    q: "Y a-t-il un engagement minimum ?",
    a: "Non. On ne verrouille personne dans un contrat de 12 mois. Si la collaboration ne crée pas de valeur, vous partez. Notre intérêt est de vous rendre les résultats visibles, pas de vous retenir.",
  },
  {
    q: "Pourquoi vous, plutôt qu'un SDR interne ou un freelance moins cher ?",
    a: "Un SDR interne coûte 5 à 8 k€ chargé par mois, met trois mois à monter en compétence et part en moyenne au bout de 12 à 18 mois. Un freelance ne touche pas à l'infrastructure (warmup, multi-domaines, deliverability) et ne dure pas non plus. On n'est ni l'un ni l'autre : on prend le sujet de bout en bout, on opère sur notre propre infrastructure (votre domaine principal reste intact), et vous gardez la main parce que tout est visible et sans engagement. C'est plus cher qu'un freelance, c'est moins risqué qu'un recrutement.",
  },
  {
    q: "C'est légal au regard du RGPD ?",
    a: "Oui. En B2B, la prospection est encadrée mais autorisée sous conditions (intérêt légitime, lien avec l'activité du destinataire, opt-out clair). On respecte ce cadre à la lettre : c'est aussi ce qui distingue un travail propre d'un envoi de masse.",
  },
  {
    q: "Quelle visibilité j'ai sur ce qui est envoyé ?",
    a: "Totale. Vous avez accès aux séquences, aux listes et aux statistiques. À chaque revue hebdomadaire, vous voyez ce qui part en votre nom, à qui, et avec quel angle. Rien n'est caché.",
  },
];
