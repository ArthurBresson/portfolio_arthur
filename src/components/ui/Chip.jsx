/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { motion } from "motion/react";
import { springPress } from "./motionPresets.js";

// Chip bascule (filtre). L'état est contrôlé par le parent :
// `pressed` + `onToggle(nextPressed)`. Exposé en aria-pressed.
// `count` (optionnel) affiche un compteur en chiffres tabulaires.
function Chip({
  pressed = false,
  onToggle,
  count,
  className = "",
  children,
  ...rest
}) {
  return (
    <motion.button
      type="button"
      className={`chip ${className}`.trim()}
      aria-pressed={pressed}
      onClick={() => onToggle?.(!pressed)}
      whileTap={{ scale: 0.96, transition: springPress }}
      {...rest}
    >
      <span>{children}</span>
      {count !== undefined && (
        <span className="chip-count tabular">{count}</span>
      )}
    </motion.button>
  );
}

export default Chip;
