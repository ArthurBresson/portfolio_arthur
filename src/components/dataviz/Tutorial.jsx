/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { motion } from "motion/react";
import Badge from "../ui/Badge.jsx";

// Bulle de tuto (première visite) : pointe la case des thèmes et explique
// que chaque graphique est un filtre. Se ferme sur « Compris » ou au
// premier filtre. La mémoire est gérée par lib/intro.js.
function Tutorial({ onDismiss }) {
  return (
    <motion.div
      className="tuto"
      role="dialog"
      aria-labelledby="tuto-text"
      initial={{ opacity: 0, y: -8, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 380, damping: 26, mass: 0.7 }}
    >
      <span className="tuto-arrow" aria-hidden="true" />
      <Badge className="tuto-badge">Astuce</Badge>
      <p id="tuto-text" className="tuto-text">
        Clique sur un thème pour voir mes projets. Chaque graphique est un
        filtre, et ils se combinent.
      </p>
      <button type="button" className="tuto-ok" onClick={onDismiss}>
        Compris
      </button>
    </motion.div>
  );
}

export default Tutorial;
