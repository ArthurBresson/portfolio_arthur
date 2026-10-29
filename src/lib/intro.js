// Règles du loader d'intro : une fois par session, jamais si l'utilisateur
// demande moins d'animations. sessionStorage peut lever une exception
// (navigation privée, stockage bloqué) : tout est protégé.
const KEY = "portfolio-intro-vue";

export function shouldPlayIntro() {
  if (globalThis.window === undefined) return false;
  try {
    if (globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return false;
    }
    return globalThis.sessionStorage.getItem(KEY) !== "1";
  } catch {
    return false;
  }
}

export function markIntroSeen() {
  try {
    globalThis.sessionStorage.setItem(KEY, "1");
  } catch {
    // Stockage indisponible : l'intro rejouera, ce n'est pas grave.
  }
}

// Tuto du dashboard : affiché tant qu'il n'a pas été fermé ou qu'aucun
// filtre n'a été essayé. localStorage pour ne pas le remontrer à chaque
// visite ; en cas d'erreur de stockage, on le montre (sans gêner).
const TUTO_KEY = "portfolio-tuto-vu";

export function shouldShowTuto() {
  try {
    return globalThis.localStorage.getItem(TUTO_KEY) !== "1";
  } catch {
    return true;
  }
}

export function markTutoSeen() {
  try {
    globalThis.localStorage.setItem(TUTO_KEY, "1");
  } catch {
    // Stockage indisponible : le tuto reviendra, ce n'est pas grave.
  }
}
