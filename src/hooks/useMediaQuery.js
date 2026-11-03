import { useCallback, useSyncExternalStore } from "react";

// Vrai tant que la media query correspond. Lu dès le premier rendu (pas de
// passage par la mauvaise version), puis suivi aux changements de taille.
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const list = globalThis.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => globalThis.matchMedia(query).matches,
  );
}
