import { useSyncExternalStore } from "react";

// Abonnement à une media query, sans re-render inutile.
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const list = globalThis.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => globalThis.matchMedia(query).matches,
    () => false,
  );
}

export default useMediaQuery;
