/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import "../../styles/sections.css";
import ContactFooter from "./ContactFooter.jsx";
import Parcours from "./Parcours.jsx";
import SectionBlock from "./SectionBlock.jsx";

// Tout le contenu sous la hero du portfolio : fond à halos, sections
// thématiques (une par entrée de `sections`), « Mon parcours » et contact.
// À monter dans <div className="ab-page"> (tokens dans tokens.css).
const ArthurSections = ({ profile }) => {
  const {
    nom,
    email,
    socials = [],
    localisation,
    sections = [],
    parcours,
  } = profile;

  return (
    <>
      <div className="ab-backdrop" aria-hidden="true">
        <span className="ab-backdrop__halo ab-backdrop__halo--1" />
        <span className="ab-backdrop__halo ab-backdrop__halo--2" />
        <span className="ab-backdrop__halo ab-backdrop__halo--3" />
        <span className="ab-backdrop__grid" />
      </div>

      <div className="ab-sections">
        {sections.map((section, index) => (
          <SectionBlock key={section.id} section={section} index={index} />
        ))}
        {parcours && <Parcours parcours={parcours} />}
        <ContactFooter
          nom={nom}
          email={email}
          socials={socials}
          localisation={localisation}
        />
      </div>
    </>
  );
};

export default ArthurSections;
