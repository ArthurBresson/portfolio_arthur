/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { motion, useReducedMotion } from "motion/react";
import ChartCard from "./ChartCard.jsx";
import { barSpring } from "../ui/motionPresets.js";
import {
  optionCounts,
  othersActive,
  pluralProjets,
} from "../../lib/filters.js";

// Projets par année de démarrage, en colonnes. Clic = filtre année.
function YearChart({ projets, options, filtre, onToggle, ready, ...rest }) {
  const reduce = useReducedMotion();
  const ghost = othersActive(filtre, "annee");
  const columns = options.map((option) => ({
    ...option,
    ...optionCounts(projets, filtre, "annee", option.id),
  }));
  const max = Math.max(1, ...columns.map((column) => column.total));
  const percent = (value) => `${(value / max) * 100}%`;

  return (
    <ChartCard title="Projets par année" hint="Année de démarrage." {...rest}>
      <ul className="year-columns">
        {columns.map((column, index) => (
          <li key={column.id}>
            <button
              type="button"
              className={`year-col${column.value === 0 ? " is-empty" : ""}`}
              aria-pressed={filtre.annee === column.id}
              aria-label={`${column.label} : ${pluralProjets(column.value)}. Filtrer par ${column.label}.`}
              onClick={() => onToggle("annee", column.id)}
            >
              <span className="year-value tabular" aria-hidden="true">
                {column.value}
                {ghost && <span className="ghost-total">/{column.total}</span>}
              </span>
              <span className="year-track" aria-hidden="true">
                <motion.span
                  className="year-ghost"
                  initial={false}
                  animate={{
                    height: ready ? percent(column.total) : "0%",
                    opacity: ghost ? 1 : 0,
                  }}
                  transition={reduce ? { duration: 0 } : barSpring}
                />
                <motion.span
                  className="year-fill"
                  initial={{ height: "0%" }}
                  animate={{ height: ready ? percent(column.value) : "0%" }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { ...barSpring, delay: ghost ? 0 : 0.08 * index }
                  }
                />
              </span>
              <span className="year-label tabular">{column.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}

export default YearChart;
