import { useEffect, useState } from "react";
import { motion } from "motion/react";
import ClassicApp from "./components/classic/ClassicApp.jsx";
import DashboardApp from "./components/dashboard/DashboardApp.jsx";
import { springHover, springPress } from "./components/ui/motionPresets.js";

// Deux versions du portfolio, dans le thème dessiné à la main : le
// dashboard 3×3 sans scroll et la page classique qui défile. Le choix vit
// dans l'URL (?v=2) pour recharger ou partager. Pas de hash : la version
// classique s'en sert déjà pour ses ancres.
const PARAM = "v";
const VERSIONS = [
  { id: "1", layout: "dashboard", label: "Dashboard" },
  { id: "2", layout: "classique", label: "Classique" },
];
const DEFAULT = VERSIONS[0];

// Anciens liens partagés : les versions 3 et 4 (dessinées) sont devenues
// 1 et 2, et « classique » date d'avant la numérotation.
const ALIASES = { 3: "1", 4: "2", classique: "2" };

function readVersion() {
  try {
    const value = new URLSearchParams(globalThis.location.search).get(PARAM);
    const id = ALIASES[value] ?? value;
    return VERSIONS.find((version) => version.id === id) ?? DEFAULT;
  } catch {
    return DEFAULT;
  }
}

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
