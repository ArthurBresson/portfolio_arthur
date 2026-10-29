/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import ClayCard from "../ui/ClayCard.jsx";
import HomeView from "./HomeView.jsx";
import ProjectsView from "./ProjectsView.jsx";
import SportView from "./SportView.jsx";
import ContactView from "./ContactView.jsx";

// Case centrale du dashboard. Une vue à la fois :
// accueil (aucun filtre), projets (filtre actif), sport ou contact.
const fade = {
  initial: { opacity: 0, scale: 0.985, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.985, y: -8 },
};
const fadeSpring = { type: "spring", stiffness: 260, damping: 28, mass: 0.8 };

function CenterPanel({
  view,
  profil,
  matching,
  filtre,
  filterKey,
  dimensions,
  lifestyle,
  langues,
  hobbies,
  onRemoveAxis,
  onClear,
  onBack,
  className = "",
  ...rest
}) {
  const reduce = useReducedMotion();

  let content;
  switch (view) {
    case "sport": {
      content = <SportView lifestyle={lifestyle} onBack={onBack} />;
      break;
    }
    case "contact": {
      content = (
        <ContactView
          profil={profil}
          lifestyle={lifestyle}
          langues={langues}
          hobbies={hobbies}
          onBack={onBack}
        />
      );
      break;
    }
    case "projects": {
      content = (
        <ProjectsView
          key={filterKey}
          projets={matching}
          filtre={filtre}
          dimensions={dimensions}
          onRemoveAxis={onRemoveAxis}
          onClear={onClear}
        />
      );
      break;
    }
    default: {
      content = <HomeView profil={profil} />;
    }
  }

  return (
    <ClayCard gold className={`center-card ${className}`.trim()} {...rest}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view}
          className="center-frame"
          {...fade}
          transition={reduce ? { duration: 0 } : fadeSpring}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </ClayCard>
  );
}

export default CenterPanel;
