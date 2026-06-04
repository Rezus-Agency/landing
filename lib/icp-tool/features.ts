/**
 * Liste des features "coming soon" affichées sur le dashboard.
 * Configuration produit, pas mock data.
 */
import type { ComingSoonFeature } from "./types";

export const COMING_SOON: ComingSoonFeature[] = [
  {
    id: "versioning",
    icon: "history",
    title: "Versioning & historique",
    desc: "Suivez comment votre ICP évolue avec votre boîte, version après version.",
  },
  {
    id: "abtest",
    icon: "split",
    title: "Multi-ICPs & A/B testing",
    desc: "Comparez plusieurs ICPs en parallèle et identifiez celui qui convertit le mieux.",
  },
  {
    id: "crm",
    icon: "plug",
    title: "Connexion CRM (feedback loop)",
    desc: "Branchez HubSpot ou Pipedrive : l'outil affine votre ICP avec vos données réelles.",
  },
  {
    id: "reverse",
    icon: "magnet",
    title: "Reverse-engineering clients",
    desc: "Listez vos meilleurs clients, on extrait l'ICP implicite qui les relie.",
  },
  {
    id: "transcript",
    icon: "mic",
    title: "Import depuis un appel discovery",
    desc: "Uploadez la transcription d'un appel, on en tire un premier ICP structuré.",
  },
  {
    id: "library",
    icon: "books",
    title: "Bibliothèque d'ICPs",
    desc: "Inspirez-vous d'ICPs anonymisés validés par d'autres founders B2B.",
  },
];
