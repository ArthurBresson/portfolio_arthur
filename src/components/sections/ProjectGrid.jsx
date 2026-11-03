/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { AnimatePresence, motion } from "motion/react";
import ProjectCard from "./ProjectCard.jsx";
import { springHover } from "../ui/motionPresets.js";

// Liste des projets. Reçoit une liste déjà filtrée, sans cartes vides : les
// projets qui entrent ou sortent au changement de filtre sont animés.
function ProjectGrid({ projets, cadres = [], competences = [] }) {
  const labelOf = (id) => cadres.find((cadre) => cadre.id === id)?.label;

  if (projets.length === 0) {
    return <p className="project-grid-empty">Aucun projet pour ce filtre.</p>;
  }

  return (
    <motion.ul className="project-grid" layout>
      <AnimatePresence initial={false} mode="popLayout">
        {projets.map((projet, index) => (
          <motion.li
            key={projet.id}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={springHover}
            className="project-grid-item"
          >
            <ProjectCard
              projet={projet}
              cadreLabel={labelOf(projet.cadre)}
              competences={competences}
              index={index}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}

export default ProjectGrid;
