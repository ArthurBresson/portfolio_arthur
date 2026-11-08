/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { useState } from "react";
import BackButton from "./BackButton.jsx";
import QualityList from "../ui/QualityList.jsx";

const TABS = [
  { id: "presentation", label: "Qui je suis" },
  { id: "savoir-etre", label: "Savoir-être" },
];

// Vue « Qui je suis » de la case centrale. Deux onglets sur toute la
// largeur (présentation, savoir-être) : les deux côte à côte ne tiennent
// pas dans la case sans défiler.
function AboutView({
  presentation = [],
  savoirEtre = [],
  parcours = [],
  onBack,
}) {
  const [tab, setTab] = useState(TABS[0].id);

  return (
    <div className="center-view detail-view">
      <h1 className="visually-hidden">Qui est Arthur Bresson</h1>
      <div className="detail-head">
        <BackButton onBack={onBack} />
        <div className="about-tabs" role="group" aria-label="Rubrique">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="about-tab"
              aria-pressed={tab === item.id}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {tab === "presentation" ? (
        <section className="detail-block">
          <h2 className="visually-hidden">Qui je suis</h2>
          {presentation.map((paragraphe) => (
            <p key={paragraphe} className="detail-apport">
              {paragraphe}
            </p>
          ))}
        </section>
      ) : (
        <section className="detail-block">
          <h2 className="visually-hidden">Savoir-être</h2>
          <QualityList savoirEtre={savoirEtre} parcours={parcours} compact />
        </section>
      )}
    </div>
  );
}

export default AboutView;
