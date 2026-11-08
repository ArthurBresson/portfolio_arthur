/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import Block from "../ui/Block.jsx";
import Reveal from "../ui/Reveal.jsx";
import Section from "../ui/Section.jsx";
import QualityList from "../ui/QualityList.jsx";

// Section « À propos » : la présentation en quelques phrases, puis le
// savoir-être (une phrase par qualité, avec un lien vers les expériences).
function About({ presentation = [], savoirEtre = [], parcours = [], number }) {
  return (
    <Section
      id="a-propos"
      number={number}
      kicker="À propos"
      icon="book"
      title="Qui je suis"
    >
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
              <QualityList
                savoirEtre={savoirEtre}
                parcours={parcours}
                anchor
                Heading="h4"
              />
            </Block>
          </Reveal>
        )}
      </div>
    </Section>
  );
}

export default About;
