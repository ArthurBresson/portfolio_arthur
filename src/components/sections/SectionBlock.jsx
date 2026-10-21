/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import AbReveal from "./AbReveal.jsx";
import ProjectCard from "./ProjectCard.jsx";

// Une section thématique : en-tête (numéro, label, titre, pitch, tags) puis
// les projets — en grille de cartes, ou en timeline pour l'expérience pro.
const SectionBlock = ({ section, index }) => {
  const { id, label, accent, title, pitch, tags = [], projects = [] } = section;
  const number = String(index + 1).padStart(2, "0");
  const isTimeline = id === "experience";
  const headingId = `${id}-title`;

  return (
    <section
      id={id}
      className={`ab-section ${isTimeline ? "ab-section--timeline" : ""}`.trim()}
      style={{ "--section-accent": accent }}
      aria-labelledby={headingId}
    >
      <div className="ab-section__inner">
        <AbReveal as="header" className="ab-section__header">
          <p className="ab-eyebrow">
            <span className="ab-eyebrow__number">{number}</span>
            <span className="ab-eyebrow__line" aria-hidden="true" />
            <span>{label}</span>
          </p>
          <h2 id={headingId} className="ab-section__title">
            {title}
          </h2>
          <p className="ab-section__pitch">{pitch}</p>
          {tags.length > 0 && (
            <ul className="ab-tags" aria-label={`Compétences ${label}`}>
              {tags.map((tag) => (
                <li key={tag} className="ab-tag">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </AbReveal>

        {isTimeline ? (
          <ol className="ab-timeline">
            {projects.map((project, position) => (
              <AbReveal
                as="li"
                key={project.title}
                className="ab-timeline__item"
                delay={position * 90}
              >
                <span className="ab-timeline__node" aria-hidden="true" />
                <ProjectCard project={project} className="ab-card--timeline" />
              </AbReveal>
            ))}
          </ol>
        ) : (
          <ul
            className={`ab-grid ${projects.length === 1 ? "ab-grid--single" : ""}`.trim()}
          >
            {projects.map((project, position) => (
              <AbReveal
                as="li"
                key={project.title}
                className="ab-grid__item"
                delay={position * 90}
              >
                <ProjectCard project={project} />
              </AbReveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default SectionBlock;
