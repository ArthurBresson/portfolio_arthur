/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";
import { ExternalIcon, UsersIcon } from "../ui/Icons.jsx";
import { formatPeriod } from "../../lib/dates.js";
import { activeAxes, pluralProjets } from "../../lib/filters.js";
import { labelOf } from "../../lib/dimensions.js";
import ProjectCompetences from "../ui/ProjectCompetences.jsx";

// Vue « projets » de la case centrale : les filtres actifs (retirables un
// par un), des onglets 1 · 2 · 3… et un seul projet à la fois.
// Flèches gauche/droite sur les onglets pour passer de l'un à l'autre.

const slide = {
  enter: (direction) => ({ opacity: 0, x: direction * 28 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction * -28 }),
};
const slideSpring = { type: "spring", stiffness: 300, damping: 30, mass: 0.8 };

function FilterPills({ filtre, dimensions, onRemoveAxis, onClear }) {
  return (
    <div className="center-filters">
      <ul className="filter-pills" aria-label="Filtres actifs">
        {activeAxes(filtre).map((axis) => {
          const label = labelOf(dimensions, axis, filtre[axis]);
          return (
            <li key={axis}>
              <button
                type="button"
                className="filter-pill"
                aria-label={`Retirer le filtre ${label}`}
                onClick={() => onRemoveAxis(axis)}
              >
                {label}
                <span aria-hidden="true">×</span>
              </button>
            </li>
          );
        })}
      </ul>
      <button type="button" className="text-button" onClick={onClear}>
        Tout effacer
      </button>
    </div>
  );
}

function ProjectsView({ projets, filtre, dimensions, onRemoveAxis, onClear }) {
  const reduce = useReducedMotion();
  const [[index, direction], setPage] = useState([0, 0]);
  const tabsReference = useRef(null);
  const count = projets.length;
  const current = projets[Math.min(index, count - 1)];

  const go = (next) => {
    const target = (next + count) % count;
    setPage([target, target > index ? 1 : -1]);
    return target;
  };

  const onTabKey = (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const target = go(index + (event.key === "ArrowRight" ? 1 : -1));
    tabsReference.current?.querySelectorAll("[role=tab]")[target]?.focus();
  };

  const pills = (
    <FilterPills
      filtre={filtre}
      dimensions={dimensions}
      onRemoveAxis={onRemoveAxis}
      onClear={onClear}
    />
  );

  if (count === 0) {
    return (
      <div className="center-view center-empty">
        <h1 className="visually-hidden">Projets d&apos;Arthur Bresson</h1>
        {pills}
        <p className="center-empty-text">
          {activeAxes(filtre).length > 1
            ? "Aucun projet pour ce mélange de filtres."
            : "Pas encore de projet pour ce filtre."}
        </p>
      </div>
    );
  }

  const cadreLabel = labelOf(dimensions, "cadre", current.cadre);
  const period = formatPeriod(current.start, current.end);

  return (
    <div className="center-view projects-view">
      <h1 className="visually-hidden">Projets d&apos;Arthur Bresson</h1>
      <div className="project-tabs-row">
        {pills}
        {count > 1 ? (
          <div
            className="project-tabs"
            role="tablist"
            aria-label={`${pluralProjets(count)} trouvés`}
            ref={tabsReference}
          >
            {projets.map((projet, tabIndex) => {
              const selected = tabIndex === index;
              return (
                <button
                  key={projet.id}
                  type="button"
                  role="tab"
                  id={`tab-${projet.id}`}
                  aria-selected={selected}
                  aria-controls="project-panel"
                  aria-label={projet.title}
                  tabIndex={selected ? 0 : -1}
                  className="project-tab tabular"
                  onClick={() => go(tabIndex)}
                  onKeyDown={onTabKey}
                >
                  {tabIndex + 1}
                  {selected && (
                    <motion.span
                      layoutId="project-tab-pill"
                      className="project-tab-pill"
                      transition={slideSpring}
                    />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="project-count">{pluralProjets(count)}</p>
        )}
      </div>

      <div className="project-stage">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.article
            key={current.id}
            id="project-panel"
            role={count > 1 ? "tabpanel" : undefined}
            aria-labelledby={count > 1 ? `tab-${current.id}` : undefined}
            className="project-panel"
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduce ? { duration: 0 } : slideSpring}
          >
            <div className="project-meta">
              {cadreLabel && <Badge tone="neutral">{cadreLabel}</Badge>}
              {period && (
                <span className="project-period tabular">{period}</span>
              )}
              {current.team > 1 && (
                <span className="project-team">
                  <UsersIcon />
                  <span className="tabular">{current.team}</span>
                  <span className="visually-hidden">personnes</span>
                </span>
              )}
            </div>
            <h2 className="project-title">{current.title}</h2>
            {current.pitch && <p className="project-pitch">{current.pitch}</p>}
            <ProjectCompetences
              ids={current.competences}
              options={dimensions.competence}
            />
            <div className="project-foot-row">
              {current.stack?.length > 0 && (
                <ul className="project-stack" aria-label="Technologies">
                  {current.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              )}
              {current.links?.length > 0 && (
                <div className="project-links">
                  {current.links.map((link) => (
                    <Button
                      key={link.url}
                      href={link.url}
                      external
                      variant="soft"
                      size="sm"
                      icon={<ExternalIcon />}
                    >
                      {link.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ProjectsView;
