/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import Block from "../ui/Block.jsx";
import {
  optionCounts,
  othersActive,
  pluralProjets,
} from "../../lib/filters.js";

// Graphique 2 : nombre de projets par thème (barres horizontales, plus
// lisibles que des colonnes avec des libellés comme « AI Engineering »).
// Chaque barre est un bouton : clic = filtre thème. Quand un autre filtre
// est actif (cadre ou compétence), la barre ne compte que les projets qui
// le respectent et le total reste en fantôme.

const barSpring = { type: "spring", stiffness: 190, damping: 26, mass: 0.8 };

function ThemeChart({ projets, themes, filtre, onToggleTheme }) {
  const listReference = useRef(null);
  const inView = useInView(listReference, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();

  const ghost = othersActive(filtre, "theme");
  const rows = themes.map((theme) => ({
    ...theme,
    ...optionCounts(projets, filtre, "theme", theme.id),
  }));
  const max = Math.max(1, ...rows.map((row) => row.total));
  const percent = (value) => `${(value / max) * 100}%`;

  return (
    <Block className="chart-card">
      <header className="chart-head">
        <h2 className="chart-title">Projets par thème</h2>
        <p className="chart-hint">
          {ghost
            ? "Pointillé : le total sans les autres filtres."
            : "Clique un thème pour filtrer."}
        </p>
      </header>

      <ul className="theme-bars" ref={listReference}>
        {rows.map((row, index) => {
          const pressed = filtre.theme === row.id;
          const label = ghost
            ? `${row.label} : ${pluralProjets(row.value)} avec les filtres actifs, ${row.total} en tout.`
            : `${row.label} : ${pluralProjets(row.total)}.`;
          const delay = inView && !ghost ? 0.06 * index : 0;
          return (
            <li key={row.id}>
              <button
                type="button"
                className={`theme-row${row.value === 0 ? " is-empty" : ""}`}
                aria-pressed={pressed}
                aria-label={`${label} Filtrer par ${row.label}.`}
                onClick={() => onToggleTheme(row.id)}
              >
                <span className="theme-row-label">{row.label}</span>
                <span className="theme-track" aria-hidden="true">
                  <motion.span
                    className="theme-ghost"
                    initial={false}
                    animate={{
                      width: inView ? percent(row.total) : "0%",
                      opacity: ghost ? 1 : 0,
                    }}
                    transition={reduce ? { duration: 0 } : barSpring}
                  />
                  <motion.span
                    className="theme-fill"
                    initial={{ width: "0%" }}
                    animate={{ width: inView ? percent(row.value) : "0%" }}
                    transition={
                      reduce ? { duration: 0 } : { ...barSpring, delay }
                    }
                  />
                </span>
                <span className="theme-row-value tabular" aria-hidden="true">
                  {row.value}
                  {ghost && (
                    <span className="theme-row-total">/{row.total}</span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Block>
  );
}

export default ThemeChart;
