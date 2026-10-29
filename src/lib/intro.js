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
