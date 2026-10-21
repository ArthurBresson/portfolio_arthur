/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { ExternalIcon, GitHubIcon } from "./Icons.jsx";
import { trackSpotlight } from "./spotlight.js";

// Carte de verre d'un projet. Tous les champs hors title/description sont
// optionnels : period, status, stack, github, link {label, url}.
const ProjectCard = ({ project, className = "" }) => {
  const {
    title,
    description,
    period,
    status,
    stack = [],
    github,
    link,
  } = project;
  const hasActions = Boolean(github || link);

  return (
    <article
      className={`ab-card ab-glass ${className}`.trim()}
      onPointerMove={trackSpotlight}
    >
      {(period || status) && (
        <div className="ab-card__meta">
          {period && <span className="ab-card__period">{period}</span>}
          {status && (
            <span className="ab-status">
              <span className="ab-status__dot" aria-hidden="true" />
              {status}
            </span>
          )}
        </div>
      )}

      <h3 className="ab-card__title">{title}</h3>
      <p className="ab-card__description">{description}</p>

      {stack.length > 0 && (
        <ul className="ab-card__stack" aria-label="Technologies">
          {stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}

      {hasActions && (
        <div className="ab-card__actions">
          {github && (
            <a
              className="ab-btn"
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Code de « ${title} » sur GitHub (nouvel onglet)`}
            >
              <GitHubIcon />
              Code
            </a>
          )}
          {link && (
            <a
              className="ab-btn ab-btn--accent"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${link.label} (nouvel onglet)`}
            >
              {link.label}
              <ExternalIcon />
            </a>
          )}
        </div>
      )}
    </article>
  );
};

export default ProjectCard;
