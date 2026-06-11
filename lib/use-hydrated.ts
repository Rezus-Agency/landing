import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Retourne false côté serveur (et au tout premier rendu client), puis true une
 * fois l'hydratation effectuée. Permet d'éviter le pattern setState-dans-effet
 * (`useEffect(() => setHydrated(true), [])`) tout en restant SSR-safe.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
