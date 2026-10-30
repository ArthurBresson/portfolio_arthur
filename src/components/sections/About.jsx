/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import Block from "../ui/Block.jsx";
import Reveal from "../ui/Reveal.jsx";
import Section from "../ui/Section.jsx";

// Section « À propos » : la présentation en quelques phrases, puis le
// savoir-être (trois qualités, chacune avec sa preuve).
function About({ presentation = [], savoirEtre = [] }) {
  return (
    <Section id="a-propos" kicker="À propos" icon="book" title="Qui je suis">
      <div className="about-grid">
        {presentation.length > 0 && (
          <Reveal>
            <div className="about-text">
              {presentation.map((paragraphe) => (
                <p key={paragraphe}>{paragraphe}</p>
              ))}
            </div>
          </Reveal>
        )}
        {savoirEtre.length > 0 && (
          <Reveal delay={0.06}>
            <Block className="about-qualities">
              <h3 className="parcours-group">Savoir-être</h3>
              <ul className="quality-list">
                {savoirEtre.map((qualite) => (
                  <li key={qualite.id} className="quality">
                    <h4 className="quality-title">{qualite.titre}</h4>
                    <p className="quality-proof">{qualite.preuve}</p>
                  </li>
                ))}
              </ul>
            </Block>
          </Reveal>
        )}
      </div>
    </Section>
  );
}

export default About;
