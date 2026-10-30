/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";
import Block from "../ui/Block.jsx";
import { ExternalIcon, UsersIcon } from "../ui/Icons.jsx";
import { formatPeriod } from "../../lib/dates.js";
import ProjectCompetences from "../ui/ProjectCompetences.jsx";

// Carte d'un projet. `cadreLabel` est résolu par la grille (id -> libellé),
// `competences` est la liste des compétences du BUT (id -> libellé).
function ProjectCard({ projet, cadreLabel, competences }) {
  const { title, pitch, stack = [], team, links = [], start, end } = projet;
  const period = formatPeriod(start, end);

  return (
    <Block as="article" interactive className="project-card">
      <h3 className="project-title">{title}</h3>
      {pitch && <p className="project-pitch">{pitch}</p>}

      {/* Cadre, dates et compétences : des repères du même ordre, sur une
          seule ligne. */}
      <div className="project-meta">
        {cadreLabel && <Badge tone="neutral">{cadreLabel}</Badge>}
        {period && <span className="project-period tabular">{period}</span>}
        <ProjectCompetences ids={projet.competences} options={competences} />
      </div>

      <footer className="project-foot">
        {(stack.length > 0 || team > 1) && (
          <div className="project-facts">
            {stack.length > 0 && (
              <ul className="project-stack" aria-label="Technologies">
                {stack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            )}
            {team > 1 && (
              <span className="project-team">
                <UsersIcon />
                <span className="tabular">{team}</span>
                <span className="visually-hidden">
                  personnes dans l&apos;équipe
                </span>
              </span>
            )}
          </div>
        )}

        {links.length > 0 && (
          <div className="project-links">
            {links.map((link) => (
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
      </footer>
    </Block>
  );
}

// Emplacement d'un projet pas encore publié : carte creuse en pointillé.
export function ProjectPlaceholder({ cadreLabel }) {
  return (
    <Block
      as="article"
      variant="hollow"
      className="project-card project-card--empty"
    >
      <span className="project-empty-mark" aria-hidden="true" />
      <p className="project-empty-title">Bientôt en ligne</p>
      {cadreLabel && <p className="project-empty-sub">Projet {cadreLabel}</p>}
    </Block>
  );
}

export default ProjectCard;
