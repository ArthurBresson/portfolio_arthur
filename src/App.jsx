import { useEffect, useState } from "react";
import { motion } from "motion/react";
import ClassicApp from "./components/classic/ClassicApp.jsx";
import DashboardApp from "./components/dashboard/DashboardApp.jsx";
import { springHover, springPress } from "./components/ui/motionPresets.js";

// Quatre versions du portfolio, à comparer en direct : deux mises en page
// (dashboard 3×3 sans scroll, page classique qui défile) et deux thèmes
// (« Tartan + or » en clair, « Crépuscule quantique » en cyberpunk).
// Le choix vit dans l'URL (?v=2) pour recharger ou partager. Pas de hash :
// la version classique s'en sert déjà pour ses ancres.
const PARAM = "v";
const VERSIONS = [
  { id: "1", layout: "dashboard", theme: "tartan", label: "Dashboard" },
  { id: "2", layout: "classique", theme: "tartan", label: "Classique" },
  {
    id: "3",
    layout: "dashboard",
    theme: "cyber",
    label: "Dashboard cyberpunk",
  },
  {
    id: "4",
    layout: "classique",
    theme: "cyber",
    label: "Classique cyberpunk",
  },
];
const DEFAULT = VERSIONS[0];

function readVersion() {
  try {
    const value = new URLSearchParams(globalThis.location.search).get(PARAM);
    // Anciens liens partagés avant la numérotation.
    if (value === "classique") return VERSIONS[1];
    return VERSIONS.find((version) => version.id === value) ?? DEFAULT;
  } catch {
    return DEFAULT;
  }
}

// Pose le thème sur <html> (le fond de page suit) et met à jour les
// métadonnées que le navigateur lit pour ses propres couleurs.
const THEME_META = {
  tartan: { scheme: "light", color: "#efe9e6" },
  cyber: { scheme: "dark", color: "#0b132b" },
};

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "cyber") root.dataset.theme = "cyber";
  else delete root.dataset.theme;
  const meta = THEME_META[theme];
  document
    .querySelector('meta[name="color-scheme"]')
    ?.setAttribute("content", meta.scheme);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", meta.color);
}

// Avant le premier rendu : pas de flash clair en ouvrant ?v=3 ou ?v=4.
applyTheme(readVersion().theme);

function writeVersion(version) {
  try {
    const url = new URL(globalThis.location.href);
    if (version === DEFAULT) url.searchParams.delete(PARAM);
    else url.searchParams.set(PARAM, version.id);
    url.hash = "";
    globalThis.history.pushState({}, "", url);
  } catch {
    // URL non modifiable : la bascule marche quand même, sans mémoire.
  }
}

function App() {
  const [version, setVersion] = useState(readVersion);

  // Boutons précédent / suivant du navigateur.
  useEffect(() => {
    const onPop = () => setVersion(readVersion());
    globalThis.addEventListener("popstate", onPop);
    return () => globalThis.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => applyTheme(version.theme), [version.theme]);

  const choose = (next) => {
    if (next === version) return;
    writeVersion(next);
    setVersion(next);
    if (next.layout !== version.layout) globalThis.scrollTo(0, 0);
  };

  return (
    <div className={`app app--${version.layout}`}>
      {version.layout === "dashboard" ? <DashboardApp /> : <ClassicApp />}
      <nav className="version-switch" aria-label="Versions du site">
        {VERSIONS.map((item) => (
          <motion.button
            key={item.id}
            type="button"
            className="version-switch-option"
            aria-pressed={item === version}
            aria-label={`Version ${item.id} : ${item.label}`}
            title={item.label}
            onClick={() => choose(item)}
            whileHover={{ y: -2, transition: springHover }}
            whileTap={{ scale: 0.92, transition: springPress }}
          >
            {item.id}
          </motion.button>
        ))}
      </nav>
    </div>
  );
}

export default App;
