/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import AbReveal from "./AbReveal.jsx";
import { GitHubIcon } from "./Icons.jsx";

// « Mon parcours » : volontairement plus compact que les sections
// thématiques — petits blocs de verre en grille.
const Block = ({ title, className = "", delay, children }) => (
  <AbReveal className={`ab-mini ab-glass ${className}`.trim()} delay={delay}>
    <h3 className="ab-mini__title">{title}</h3>
    {children}
  </AbReveal>
);

const EntryList = ({ entries }) => (
  <ul className="ab-entries">
    {entries.map((entry) => (
      <li key={entry.title} className="ab-entry">
        <h4 className="ab-entry__title">{entry.title}</h4>
        <p className="ab-entry__meta">
          {entry.place}
          {entry.period && (
            <>
              <span aria-hidden="true"> · </span>
              {entry.period}
            </>
          )}
        </p>
        {entry.description && (
          <p className="ab-entry__description">{entry.description}</p>
        )}
      </li>
    ))}
  </ul>
);

const Parcours = ({ parcours = {} }) => {
  const {
    formation = [],
    experiences = [],
    autresProjets = [],
    langues = [],
    softSkills = [],
  } = parcours;

  return (
    <section
      id="parcours"
      className="ab-section ab-parcours"
      aria-labelledby="parcours-title"
    >
      <div className="ab-section__inner ab-parcours__inner">
        <AbReveal as="header" className="ab-parcours__header">
          <p className="ab-eyebrow">
            <span className="ab-eyebrow__number">{"//"}</span>
            <span className="ab-eyebrow__line" aria-hidden="true" />
            <span>Background</span>
          </p>
          <h2 id="parcours-title" className="ab-parcours__title">
            Mon parcours
          </h2>
        </AbReveal>

        <div className="ab-parcours__grid">
          {formation.length > 0 && (
            <Block title="Formation" className="ab-mini--wide">
              <EntryList entries={formation} />
            </Block>
          )}

          {experiences.length > 0 && (
            <Block title="Autres expériences" delay={80}>
              <EntryList entries={experiences} />
            </Block>
          )}

          <div className="ab-parcours__column">
            {autresProjets.length > 0 && (
              <Block title="Autres projets" delay={120}>
                <ul className="ab-entries">
                  {autresProjets.map((project) => (
                    <li key={project.title} className="ab-entry">
                      <h4 className="ab-entry__title">{project.title}</h4>
                      <p className="ab-entry__description">
                        {project.description}
                      </p>
                      {project.github && (
                        <a
                          className="ab-btn ab-btn--small"
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Code de « ${project.title} » sur GitHub (nouvel onglet)`}
                        >
                          <GitHubIcon />
                          Code
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            {langues.length > 0 && (
              <Block title="Langues" delay={160}>
                <dl className="ab-langs">
                  {langues.map((langue) => (
                    <div key={langue.name} className="ab-langs__row">
                      <dt>{langue.name}</dt>
                      <dd>{langue.level}</dd>
                    </div>
                  ))}
                </dl>
              </Block>
            )}

            {softSkills.length > 0 && (
              <Block title="Soft skills" delay={200}>
                <ul className="ab-tags ab-tags--small">
                  {softSkills.map((skill) => (
                    <li key={skill} className="ab-tag">
                      {skill}
                    </li>
                  ))}
                </ul>
              </Block>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Parcours;
