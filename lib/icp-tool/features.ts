/**
 * Liste des features "coming soon" affichées sur le dashboard.
 * Configuration produit, pas mock data.
 */
import type { ComingSoonFeature } from "./types";

export const COMING_SOON: ComingSoonFeature[] = [
  {
    id: "reverse",
    icon: "magnet",
    title: "Reverse-engineering clients",
    desc: "Listez vos meilleurs clients, on extrait l'ICP implicite qui les relie.",
  },
  {
    id: "committee",
    icon: "grid",
    title: "Cartographie du comité d'achat",
    desc: "Au-delà du décideur : qui décide, qui influence et qui bloque dans le compte cible.",
  },
  {
    id: "deepen",
    icon: "target",
    title: "Approfondir un sous-segment",
    desc: "Zoomez sur une niche précise de votre ICP et relancez une recherche dédiée.",
  },
  {
    id: "compare",
    icon: "split",
    title: "Comparer plusieurs ICPs",
    desc: "Mettez plusieurs cibles côte à côte et identifiez laquelle creuser en priorité.",
  },
  {
    id: "crm",
    icon: "plug",
    title: "Connexion CRM",
    desc: "Branchez HubSpot ou Pipedrive : l'outil affine la définition de votre ICP avec vos vrais clients gagnés et perdus.",
  },
  {
    id: "refresh",
    icon: "history",
    title: "Rafraîchir votre ICP",
    desc: "Relancez la recherche quand votre boîte ou votre marché évolue, pour garder un ICP à jour.",
  },
];
