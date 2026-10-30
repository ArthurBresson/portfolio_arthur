/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { motion } from "motion/react";
import Badge from "../ui/Badge.jsx";

// Astuce de première visite, posée dans l'accueil à la place de la ligne
// d'aide : elle explique que chaque graphique est un filtre sans rien
// recouvrir. Se ferme sur « OK » ou au premier filtre. La mémoire est
// gérée par lib/intro.js.
function Tutorial({ onDismiss }) {
  return (
    <motion.div
      className="tuto"
      role="note"
      aria-labelledby="tuto-text"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ type: "spring", stiffness: 380, damping: 26, mass: 0.7 }}
    >
      <p id="tuto-text" className="tuto-text">
        <Badge className="tuto-badge">Astuce</Badge> Chaque graphique est un
        filtre. Clique pour voir mes projets.
      </p>
      <button type="button" className="tuto-ok" onClick={onDismiss}>
        OK
      </button>
    </motion.div>
  );
}

export default Tutorial;
