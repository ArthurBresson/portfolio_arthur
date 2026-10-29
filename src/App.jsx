import { useEffect, useState } from "react";
import { motion } from "motion/react";
import ClassicApp from "./components/classic/ClassicApp.jsx";
import DashboardApp from "./components/dashboard/DashboardApp.jsx";
import { springHover, springPress } from "./components/ui/motionPresets.js";

// Deux versions du portfolio, à comparer en direct :
// - « Dashboard » (défaut) : grille 3×3 sans scroll ;
// - « Classique » : la page qui défile (commit 7f1ef96).
// Le choix vit dans l'URL (?v=classique) pour recharger ou partager. Pas
// de hash : la version classique s'en sert déjà pour ses ancres.
const PARAM = "v";

function readVersion() {
  try {
    return new URLSearchParams(globalThis.location.search).get(PARAM) ===
      "classique"
      ? "classique"
      : "dashboard";
  } catch {
    return "dashboard";
  }
}

function writeVersion(version) {
  try {
    const url = new URL(globalThis.location.href);
    if (version === "classique") url.searchParams.set(PARAM, "classique");
    else url.searchParams.delete(PARAM);
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

  const other = version === "dashboard" ? "classique" : "dashboard";
  const switchVersion = () => {
    writeVersion(other);
    setVersion(other);
    globalThis.scrollTo(0, 0);
  };

  return (
    <div className={`app app--${version}`}>
      {version === "dashboard" ? <DashboardApp /> : <ClassicApp />}
      <motion.button
        type="button"
        className="version-switch"
        onClick={switchVersion}
        whileHover={{ y: -2, transition: springHover }}
        whileTap={{ scale: 0.96, transition: springPress }}
        aria-label={`Passer à la version ${other}`}
      >
        <span className={version === "dashboard" ? "is-current" : ""}>
          Dashboard
        </span>
        <span className="version-switch-arrow" aria-hidden="true">
          ⇄
        </span>
        <span className={version === "classique" ? "is-current" : ""}>
          Classique
        </span>
      </motion.button>
    </div>
  );
}

export default App;
