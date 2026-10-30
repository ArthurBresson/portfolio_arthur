/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import ChartCard from "./ChartCard.jsx";
import AnimatedIcon from "../ui/AnimatedIcon.jsx";
import { countMatching, pluralProjets } from "../../lib/filters.js";

// Compétences du BUT : toutes acquises, donc une coche par ligne et pas de
// barre. Une barre courte se lisait comme une compétence faible alors
// qu'elle comptait seulement les projets. Le nombre de projets reste à
// droite, en preuve, et la ligne filtre au clic. Une option
// `parcours: true` reçoit un point doré.

function CompetenceChart({
  projets,
  options,
  filtre,
  onToggle,
  axis = "competence",
  className = "",
  ...rest
}) {
  return (
    <ChartCard
      title="Compétences du BUT"
      hint="Toutes acquises. Clique pour voir les projets."
      className={`competence-chart ${className}`.trim()}
      {...rest}
    >
      <ul className="competence-list">
        {options.map((option, index) => {
          const pressed = filtre[axis] === option.id;
          const count = countMatching(projets, {
            ...filtre,
            [axis]: option.id,
          });
          return (
            <li key={option.id}>
              <button
                type="button"
                className="competence-row"
                aria-pressed={pressed}
                disabled={count === 0 && !pressed}
                aria-label={`${option.label}, acquise${option.parcours ? ", cœur du parcours" : ""}. ${count > 0 ? `${pluralProjets(count)}. Filtrer par ${option.label}.` : "Aucun projet du portfolio ne la montre encore."}`}
                title={option.detail}
                onClick={() => onToggle(axis, option.id)}
              >
                {/* La coche se dessine pendant l'animation (image vide au
                    départ) : on la joue à l'arrivée, l'une après l'autre,
                    et elle reste tracée. */}
                <AnimatedIcon
                  name="check"
                  size={22}
                  trigger={`in(${index * 120})`}
                  className="competence-check"
                />
                <span className="competence-label">
                  {option.label}
                  {option.parcours && (
                    <span className="parcours-dot" aria-hidden="true" />
                  )}
                </span>
                {count > 0 && (
                  <span className="competence-count" aria-hidden="true">
                    {pluralProjets(count)}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </ChartCard>
  );
}

export default CompetenceChart;
