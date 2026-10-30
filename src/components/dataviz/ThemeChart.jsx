/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { motion, useReducedMotion } from "motion/react";
import ChartCard from "./ChartCard.jsx";
import { barSpring } from "../ui/motionPresets.js";
import {
  optionCounts,
  othersActive,
  pluralProjets,
} from "../../lib/filters.js";

// Projets par option d'un axe (thème, compétence…), en barres
// horizontales lisibles avec des libellés longs. Chaque barre est un
// bouton : clic = filtre. Quand un autre axe filtre, la barre ne compte
// que ce qui reste et le total reste en pointillé derrière. Une option
// `parcours: true` reçoit un point doré.

function ThemeChart({
  projets,
  options,
  filtre,
  onToggle,
  ready,
  axis = "theme",
  title = "Projets par thème",
  className = "",
  ...rest
}) {
  const reduce = useReducedMotion();
  const ghost = othersActive(filtre, axis);
  const rows = options.map((option) => ({
    ...option,
    ...optionCounts(projets, filtre, axis, option.id),
  }));
  const max = Math.max(1, ...rows.map((row) => row.total));
  const percent = (value) => `${(value / max) * 100}%`;

  return (
    <ChartCard
      title={title}
      className={`bar-chart--${axis} ${className}`.trim()}
      {...rest}
    >
      <ul className="theme-bars">
        {rows.map((row, index) => {
          const pressed = filtre[axis] === row.id;
          // Aucun projet pour cette option, même sans autre filtre : rien à
          // filtrer, la barre l'indique au lieu de mener à un écran vide.
          const none = row.total === 0;
          return (
            <li key={row.id}>
              <button
                type="button"
                className={`theme-row${row.value === 0 ? " is-empty" : ""}`}
                aria-pressed={pressed}
                disabled={none}
                aria-label={
                  none
                    ? `${row.label} : pas encore de projet.`
                    : `${row.label}${row.parcours ? " (cœur du parcours)" : ""} : ${pluralProjets(row.value)}${ghost ? ` sur ${row.total}` : ""}. Filtrer par ${row.label}.`
                }
                title={row.detail}
                onClick={() => onToggle(axis, row.id)}
              >
                <span className="theme-row-label">
                  {row.label}
                  {row.parcours && (
                    <span className="parcours-dot" aria-hidden="true" />
                  )}
                </span>
                <span className="theme-track" aria-hidden="true">
                  <motion.span
                    className="theme-ghost"
                    initial={false}
                    animate={{
                      width: ready ? percent(row.total) : "0%",
                      opacity: ghost ? 1 : 0,
                    }}
                    transition={reduce ? { duration: 0 } : barSpring}
                  />
                  <motion.span
                    className="theme-fill"
                    initial={{ width: "0%" }}
                    animate={{ width: ready ? percent(row.value) : "0%" }}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { ...barSpring, delay: ghost ? 0 : 0.05 * index }
                    }
                  />
                </span>
                <span className="theme-row-value tabular" aria-hidden="true">
                  {none ? (
                    <span className="theme-row-none">à venir</span>
                  ) : (
                    <>
                      {row.value}
                      {ghost && (
                        <span className="ghost-total">/{row.total}</span>
                      )}
                    </>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </ChartCard>
  );
}

export default ThemeChart;
