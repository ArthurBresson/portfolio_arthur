/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import Block from "../ui/Block.jsx";
import Reveal from "../ui/Reveal.jsx";
import Section from "../ui/Section.jsx";
import { byStartDesc, formatPeriod } from "../../lib/dates.js";

const GROUPS = [
  { type: "experience", title: "Expériences" },
  { type: "formation", title: "Formation" },
];

// Version lisible du parcours : deux colonnes, du plus récent au plus ancien.
function Parcours({ parcours = [] }) {
  return (
    <Section
      id="parcours"
      kicker="Parcours"
      icon="suitcase"
      title="Formation et expériences"
    >
      <div className="parcours-grid">
        {GROUPS.map((group, index) => {
          const entries = parcours
            .filter((entry) => entry.type === group.type)
            .toSorted(byStartDesc);
          if (entries.length === 0) return;
          return (
            <Reveal key={group.type} delay={index * 0.06}>
              <Block className="parcours-card">
                <h3 className="parcours-group">{group.title}</h3>
                <ol className="parcours-list">
                  {entries.map((entry) => (
                    <li key={entry.id} className="parcours-item">
                      <p className="parcours-period tabular">
                        {formatPeriod(entry.start, entry.end)}
                      </p>
                      <div className="parcours-body">
                        <p className="parcours-title">{entry.title}</p>
                        {entry.place && (
                          <p className="parcours-place">{entry.place}</p>
                        )}
                        {entry.detail && (
                          <p className="parcours-detail">{entry.detail}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </Block>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

export default Parcours;
