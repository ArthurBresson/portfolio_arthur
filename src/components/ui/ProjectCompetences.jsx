/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */

// Compétences du BUT prouvées par un projet. Celles du cœur du parcours
// data portent un point bleu, comme dans le graphique des compétences.
function ProjectCompetences({ ids = [], options = [] }) {
  const items = options.filter((option) => ids.includes(option.id));
  if (items.length === 0) return;
  return (
    <ul
      className="project-competences"
      role="list"
      aria-label="Compétences du BUT"
    >
      {items.map((item) => (
        <li key={item.id} className={item.parcours ? "is-parcours" : undefined}>
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export default ProjectCompetences;
