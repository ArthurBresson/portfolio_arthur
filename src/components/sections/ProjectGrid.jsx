/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { AnimatePresence, motion } from "motion/react";
import ProjectCard, { ProjectPlaceholder } from "./ProjectCard.jsx";
import { springHover } from "../ui/motionPresets.js";

// Grille de projets. Reçoit une liste déjà filtrée : les cartes qui entrent
// ou sortent sont animées (layout + présence), prêtes pour le filtre croisé.
function ProjectGrid({ projets, cadres = [] }) {
  const labelOf = (id) => cadres.find((cadre) => cadre.id === id)?.label;

  if (projets.length === 0) {
    return <p className="project-grid-empty">Aucun projet pour ce filtre.</p>;
  }

  return (
    <motion.ul className="project-grid" layout>
      <AnimatePresence initial={false} mode="popLayout">
        {projets.map((projet) => (
          <motion.li
            key={projet.id}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={springHover}
            className="project-grid-item"
          >
            {projet.placeholder ? (
              <ProjectPlaceholder cadreLabel={labelOf(projet.cadre)} />
            ) : (
              <ProjectCard projet={projet} cadreLabel={labelOf(projet.cadre)} />
            )}
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}

export default ProjectGrid;
