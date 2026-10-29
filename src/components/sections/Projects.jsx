/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import ProjectGrid from "./ProjectGrid.jsx";
import Section from "../ui/Section.jsx";

// Section projets.
// - projets : liste à afficher (déjà filtrée par le parent)
// - cadres : référentiel id -> libellé
// - competences : compétences du BUT, affichées sur chaque carte
// - filters : ReactNode optionnel rendu au-dessus de la grille (chips)
function Projects({ projets, cadres, competences, filters }) {
  return (
    <Section id="projets" kicker="Projets" title="Ce que j'ai construit">
      <div data-slot="filters" className="project-filters">
        {filters}
      </div>
      <ProjectGrid
        projets={projets}
        cadres={cadres}
        competences={competences}
      />
    </Section>
  );
}

export default Projects;
