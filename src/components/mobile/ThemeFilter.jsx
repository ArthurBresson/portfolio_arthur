/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import Chip from "../ui/Chip.jsx";
import { countMatching } from "../../lib/filters.js";

// Filtre des projets sur téléphone : une seule rangée de thèmes qui défile
// à l'horizontale, « Tous » en tête. Un seul axe à la fois, plus simple au
// pouce que les trois groupes de puces de l'ancienne version.
function ThemeFilter({ projets, themes, value, onChange }) {
  const items = themes
    .map((theme) => ({
      ...theme,
      count: countMatching(projets, { theme: theme.id }),
    }))
    .filter((theme) => theme.count > 0);

  return (
    <div className="m-filter" role="group" aria-label="Filtrer par thème">
      <Chip pressed={!value} count={projets.length} onToggle={() => onChange()}>
        Tous
      </Chip>
      {items.map((theme) => (
        <Chip
          key={theme.id}
          pressed={value === theme.id}
          count={theme.count}
          onToggle={(next) => onChange(next ? theme.id : undefined)}
        >
          {theme.label}
        </Chip>
      ))}
    </div>
  );
}

export default ThemeFilter;
