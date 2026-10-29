/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { AnimatePresence, motion } from "motion/react";
import { countMatching, isActive, pluralProjets } from "../../lib/filters.js";
import { springHover } from "../ui/motionPresets.js";

// Défilement vers la grille ; le focus suit (clavier, lecteurs d'écran).
function goToProjects() {
  const target = document.querySelector("#projets");
  if (!target) return;
  target.scrollIntoView({ block: "start" });
  target
    .querySelector("[data-slot='filters'] [aria-pressed='true']")
    ?.focus({ preventScroll: true });
}

// Résumé sous les graphiques du hero : un clic dans un graphique ne fait
// pas défiler la page, il affiche « 2 projets IUT · Web » + un lien vers
// la grille.
function FilterSummary({ projets, cadres, themes, filtre, onReset }) {
  const active = isActive(filtre);
  const count = countMatching(projets, filtre);
  const parts = [
    cadres.find((cadre) => cadre.id === filtre.cadre)?.label,
    themes.find((theme) => theme.id === filtre.theme)?.label,
  ].filter(Boolean);

  return (
    <div className="chart-summary" aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        {active ? (
          <motion.div
            key="actif"
            className="chart-summary-inner"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={springHover}
          >
            <p className="chart-summary-text">
              <strong className="tabular">
                {count === 0 ? "Aucun projet" : pluralProjets(count)}
              </strong>{" "}
              {parts.join(" · ")}
            </p>
            {count > 0 && (
              <button
                type="button"
                className="chart-summary-link"
                onClick={goToProjects}
              >
                Voir <span aria-hidden="true">→</span>
              </button>
            )}
            <button
              type="button"
              className="chart-summary-reset"
              onClick={onReset}
            >
              Tout afficher
            </button>
          </motion.div>
        ) : (
          <motion.p
            key="repos"
            className="chart-summary-idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            Les deux graphiques filtrent les projets ci-dessous.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FilterSummary;
