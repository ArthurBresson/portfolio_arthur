/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import Badge from "../ui/Badge.jsx";
import ClayCard from "../ui/ClayCard.jsx";
import Reveal from "../ui/Reveal.jsx";
import Section from "../ui/Section.jsx";
import Stat from "../ui/Stat.jsx";

// Disciplines dont les stats sont des chronos : valeurs en or (perfs).
const PERF_IDS = new Set(["cap"]);

// Une activité du bento : stats, courses (temps en badge or), apport.
function ActivityCard({ activite }) {
  const { id, title, stats = [], courses = [], apport } = activite;
  const isPerf = PERF_IDS.has(id);

  return (
    <ClayCard
      as="article"
      interactive
      className={`bento-card bento-card--${id}`}
    >
      <h3 className="bento-title">{title}</h3>

      {stats.length > 0 && (
        <dl className="stat-list bento-stats">
          {stats.map((stat) => (
            <Stat
              key={stat.label}
              value={stat.value}
              label={stat.label}
              gold={isPerf}
            />
          ))}
        </dl>
      )}

      {courses.length > 0 && (
        <ul className="race-list" aria-label="Courses">
          {courses.map((course) => (
            <li key={`${course.lieu}-${course.format}`} className="race">
              <span className="race-place">{course.lieu}</span>
              <span className="race-format">{course.format}</span>
              <Badge className="race-time tabular">{course.temps}</Badge>
            </li>
          ))}
        </ul>
      )}

      {apport && <p className="bento-apport">{apport}</p>}
    </ClayCard>
  );
}

// Section « hors code » en bento : activités, puis jeux et langues.
function Lifestyle({ lifestyle = [], hobbies = [], langues = [] }) {
  return (
    <Section
      id="hors-code"
      kicker="Hors code"
      title="Sport, échecs et le reste"
    >
      <div className="bento">
        {lifestyle.map((activite, index) => (
          <Reveal
            key={activite.id}
            delay={index * 0.05}
            className={`bento-cell bento-cell--${activite.id}`}
          >
            <ActivityCard activite={activite} />
          </Reveal>
        ))}

        {hobbies.length > 0 && (
          <Reveal delay={0.1} className="bento-cell bento-cell--hobbies">
            <ClayCard
              as="article"
              interactive
              className="bento-card bento-card--small"
            >
              <h3 className="bento-title">Loisirs</h3>
              <ul className="tag-list">
                {hobbies.map((hobby) => (
                  <li key={hobby}>
                    <Badge tone="neutral">{hobby}</Badge>
                  </li>
                ))}
              </ul>
            </ClayCard>
          </Reveal>
        )}

        {langues.length > 0 && (
          <Reveal delay={0.15} className="bento-cell bento-cell--langues">
            <ClayCard
              as="article"
              interactive
              className="bento-card bento-card--small"
            >
              <h3 className="bento-title">Langues</h3>
              <dl className="lang-list">
                {langues.map((langue) => (
                  <div key={langue.name} className="lang">
                    <dt>{langue.name}</dt>
                    <dd>{langue.level}</dd>
                  </div>
                ))}
              </dl>
            </ClayCard>
          </Reveal>
        )}
      </div>
    </Section>
  );
}

export default Lifestyle;
