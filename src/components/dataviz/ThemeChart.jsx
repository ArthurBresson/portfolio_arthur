/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { motion, useReducedMotion } from "motion/react";
import ChartCard from "./ChartCard.jsx";
import { barSpring } from "../ui/motionPresets.js";
import {
  optionCounts,
  othersActive,
  pluralProjets,
} from "../../lib/filters.js";

// Projets par thème, en barres horizontales (lisibles avec des libellés
// comme « AI Engineering »). Chaque barre est un bouton : clic = filtre.
// Quand un autre axe filtre, la barre ne compte que ce qui reste et le
// total reste en pointillé derrière.

function ThemeChart({ projets, options, filtre, onToggle, ready, ...rest }) {
  const reduce = useReducedMotion();
  const ghost = othersActive(filtre, "theme");
  const rows = options.map((option) => ({
    ...option,
    ...optionCounts(projets, filtre, "theme", option.id),
  }));
  const max = Math.max(1, ...rows.map((row) => row.total));
  const percent = (value) => `${(value / max) * 100}%`;

  return (
    <ChartCard
      title="Projets par thème"
      hint={
        ghost ? "Le total reste en pointillé." : "Clique un thème pour filtrer."
      }
      {...rest}
    >
      <ul className="theme-bars">
        {rows.map((row, index) => {
          const pressed = filtre.theme === row.id;
          return (
            <li key={row.id}>
              <button
                type="button"
                className={`theme-row${row.value === 0 ? " is-empty" : ""}`}
                aria-pressed={pressed}
                aria-label={`${row.label} : ${pluralProjets(row.value)}${ghost ? ` sur ${row.total}` : ""}. Filtrer par ${row.label}.`}
                onClick={() => onToggle("theme", row.id)}
              >
                <span className="theme-row-label">{row.label}</span>
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
                  {row.value}
                  {ghost && <span className="ghost-total">/{row.total}</span>}
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
