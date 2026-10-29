/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import ProjectGrid from "./ProjectGrid.jsx";
import Section from "../ui/Section.jsx";

// Section projets.
// - projets : liste à afficher (déjà filtrée par le parent)
// - cadres : référentiel id -> libellé
// - filters : ReactNode optionnel rendu au-dessus de la grille (chips)
function Projects({ projets, cadres, filters }) {
  return (
    <Section id="projets" kicker="Projets" title="Ce que j'ai construit">
      <div data-slot="filters" className="project-filters">
        {filters}
      </div>
      <ProjectGrid projets={projets} cadres={cadres} />
    </Section>
  );
}

export default Projects;
