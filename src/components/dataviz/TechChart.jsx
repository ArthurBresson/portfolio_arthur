/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { motion } from "motion/react";
import ChartCard from "./ChartCard.jsx";
import {
  optionCounts,
  othersActive,
  pluralProjets,
} from "../../lib/filters.js";

// Langages et outils : une bulle par techno, sa taille suit le nombre de
// projets. Clic = filtre techno.

const popSpring = { type: "spring", stiffness: 320, damping: 22, mass: 0.7 };

function TechChart({ projets, options, filtre, onToggle, ready, ...rest }) {
  const ghost = othersActive(filtre, "techno");
  const bubbles = options.map((option) => ({
    ...option,
    ...optionCounts(projets, filtre, "techno", option.id),
  }));
  const max = Math.max(1, ...bubbles.map((bubble) => bubble.total));

  return (
    <ChartCard
      title="Langages et outils"
      hint="Plus la bulle est grosse, plus je l'utilise."
      {...rest}
    >
      <ul className="tech-cloud">
        {bubbles.map((bubble, index) => {
          const pressed = filtre.techno === bubble.id;
          // Échelle 0 → 1 selon le total, appliquée au padding et au texte.
          const weight = Math.sqrt(bubble.total / max);
          return (
            <motion.li
              key={bubble.id}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={ready ? { scale: 1, opacity: 1 } : {}}
              transition={{ ...popSpring, delay: 0.04 * index }}
            >
              <button
                type="button"
                className={`tech-bubble${bubble.value === 0 ? " is-empty" : ""}`}
                style={{ "--weight": weight }}
                aria-pressed={pressed}
                aria-label={`${bubble.label} : ${pluralProjets(bubble.value)}. Filtrer par ${bubble.label}.`}
                onClick={() => onToggle("techno", bubble.id)}
              >
                <span>{bubble.label}</span>
                <span className="tech-count tabular" aria-hidden="true">
                  {bubble.value}
                  {ghost && bubble.value !== bubble.total && (
                    <span className="ghost-total">/{bubble.total}</span>
                  )}
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </ChartCard>
  );
}

export default TechChart;
