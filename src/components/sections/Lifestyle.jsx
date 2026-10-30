/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import AnimatedIcon from "../ui/AnimatedIcon.jsx";
import Badge from "../ui/Badge.jsx";
import Block from "../ui/Block.jsx";
import Reveal from "../ui/Reveal.jsx";
import Section from "../ui/Section.jsx";
import Stat from "../ui/Stat.jsx";

// Disciplines dont les stats sont des chronos : valeurs en or (perfs).
const PERF_IDS = new Set(["cap"]);
// Icône Lordicon de chaque activité, jouée au survol du bloc.
const ICONS = { triathlon: "cup", cap: "clock", echecs: "target" };

// Une activité du bento : stats, courses (temps en badge or), apport.
function ActivityCard({ activite }) {
  const { id, title, stats = [], courses = [], apport } = activite;
  const isPerf = PERF_IDS.has(id);

  return (
    <Block as="article" interactive className={`bento-card bento-card--${id}`}>
      <h3 className="bento-title">
        {ICONS[id] && (
          <AnimatedIcon name={ICONS[id]} size={24} target=".bento-card" />
        )}
        {title}
      </h3>

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
    </Block>
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
            <Block
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
            </Block>
          </Reveal>
        )}

        {langues.length > 0 && (
          <Reveal delay={0.15} className="bento-cell bento-cell--langues">
            <Block
              as="article"
              interactive
              className="bento-card bento-card--small"
            >
              <h3 className="bento-title">
                <AnimatedIcon name="globe" size={24} target=".bento-card" />
                Langues
              </h3>
              <dl className="lang-list">
                {langues.map((langue) => (
                  <div key={langue.name} className="lang">
                    <dt>{langue.name}</dt>
                    <dd>{langue.level}</dd>
                  </div>
                ))}
              </dl>
            </Block>
          </Reveal>
        )}
      </div>
    </Section>
  );
}

export default Lifestyle;
