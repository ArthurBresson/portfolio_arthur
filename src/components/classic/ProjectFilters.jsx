/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import Chip from "../ui/Chip.jsx";
import { NO_FILTER, countMatching, isActive } from "../../lib/filters.js";

// Chips du filtre croisé, au-dessus de la grille. Chaque compteur tient
// compte de l'autre axe (ex. : « Web 2 » quand IUT est actif). Une chip
// qui donnerait 0 résultat est désactivée.
function ProjectFilters({
  projets,
  cadres,
  themes,
  competences,
  filtre,
  onChange,
}) {
  const groups = [
    { axis: "cadre", title: "Cadre", items: cadres },
    { axis: "theme", title: "Thème", items: themes },
    // Une compétence sans projet n'a rien à filtrer ; une puce grisée à 0
    // la ferait passer pour non acquise.
    {
      axis: "competence",
      title: "Compétence",
      items: competences.filter(
        (item) =>
          countMatching(projets, { ...NO_FILTER, competence: item.id }) > 0,
      ),
    },
  ];

  return (
    <>
      {groups.map(({ axis, title, items }) => (
        <div
          key={axis}
          className="filter-group"
          role="group"
          aria-labelledby={`filtre-${axis}`}
        >
          <span id={`filtre-${axis}`} className="filter-group-title">
            {title}
          </span>
          {items.map((item) => {
            const pressed = filtre[axis] === item.id;
            const count = countMatching(projets, {
              ...filtre,
              [axis]: item.id,
            });
            return (
              <Chip
                key={item.id}
                pressed={pressed}
                count={count}
                disabled={count === 0 && !pressed}
                onToggle={(next) => onChange(axis, next ? item.id : undefined)}
              >
                {item.label}
              </Chip>
            );
          })}
        </div>
      ))}
      <button
        type="button"
        className="filter-reset"
        onClick={() => onChange()}
        disabled={!isActive(filtre)}
      >
        Tout afficher
      </button>
    </>
  );
}

export default ProjectFilters;
