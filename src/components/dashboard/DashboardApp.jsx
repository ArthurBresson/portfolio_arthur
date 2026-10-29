import { useCallback, useState } from "react";
import { AnimatePresence, MotionConfig } from "motion/react";
import TimelineChart from "../dataviz/TimelineChart.jsx";
import ThemeChart from "../dataviz/ThemeChart.jsx";
import TechChart from "../dataviz/TechChart.jsx";
import TeamChart from "../dataviz/TeamChart.jsx";
import StatusChart from "../dataviz/StatusChart.jsx";
import SportCard from "../dataviz/SportCard.jsx";
import ContactCard from "../dataviz/ContactCard.jsx";
import IntroLoader, { IntroBoundary } from "../dataviz/IntroLoader.jsx";
import CenterPanel from "../center/CenterPanel.jsx";
import {
  AXES,
  NO_FILTER,
  clearAxis,
  isActive,
  matches,
  pluralProjets,
  realProjets,
  toggleFrom,
} from "../../lib/filters.js";
import { buildDimensions } from "../../lib/dimensions.js";
import {
  markTutoSeen,
  shouldPlayIntro,
  shouldShowTuto,
} from "../../lib/intro.js";
import {
  profil,
  cadres,
  themes,
  competences,
  parcours,
  projets,
  lifestyle,
  hobbies,
  langues,
} from "../../data/portfolio.js";

const projetsReels = realProjets(projets);
const dimensions = buildDimensions(projetsReels, {
  cadres,
  themes,
  competences,
});

// Version « Dashboard » : une grille 3×3 sans scroll (desktop). Autour du
// centre, 6 graphiques qui filtrent et 2 cases (sport, contact) qui ouvrent
// leur détail ; la case centrale montre l'accueil, les projets filtrés, le
// sport ou le contact.
function DashboardApp() {
  const [filtre, setFiltre] = useState(NO_FILTER);
  // Vue forcée au centre ("sport" | "contact") ; sinon elle suit le filtre.
  const [detail, setDetail] = useState();
  const [introVisible, setIntroVisible] = useState(shouldPlayIntro);
  const [tuto, setTuto] = useState(shouldShowTuto);
  const endIntro = useCallback(() => setIntroVisible(false), []);
  const ready = !introVisible;

  const closeTuto = () => {
    setTuto(false);
    markTutoSeen();
  };

  const toggle = (axis, id) => {
    setFiltre((current) => toggleFrom(projetsReels, current, axis, id));
    setDetail();
    if (tuto) closeTuto();
  };
  const removeAxis = (axis) => setFiltre((current) => clearAxis(current, axis));
  const clear = () => setFiltre(NO_FILTER);
  const openDetail = (view) =>
    setDetail((current) => (current === view ? undefined : view));

  const active = isActive(filtre);
  const view = detail ?? (active ? "projects" : "home");
  const matching = projetsReels.filter((projet) => matches(projet, filtre));
  const filterKey = AXES.map((axis) => filtre[axis] ?? "").join("|");

  const chartProperties = {
    projets: projetsReels,
    filtre,
    onToggle: toggle,
    ready,
  };

  return (
    <MotionConfig reducedMotion="user">
      <main className="dash" aria-label="Portfolio d'Arthur Bresson">
        <TimelineChart
          className="dash-cell dash-cell--frise"
          parcours={parcours}
          cadres={cadres}
          {...chartProperties}
        />
        <div
          className={`dash-cell dash-cell--themes${tuto && ready ? " is-tuto-target" : ""}`}
        >
          <ThemeChart options={dimensions.theme} {...chartProperties} />
        </div>
        <TechChart
          className="dash-cell dash-cell--tech"
          options={dimensions.techno}
          {...chartProperties}
        />
        <ThemeChart
          className="dash-cell dash-cell--competences"
          axis="competence"
          title="Compétences du BUT"
          hint="Point doré : cœur de mon parcours data."
          options={dimensions.competence}
          {...chartProperties}
        />
        <CenterPanel
          className="dash-cell dash-cell--center"
          view={view}
          profil={profil}
          matching={matching}
          total={projetsReels.length}
          filtre={filtre}
          filterKey={filterKey}
          dimensions={dimensions}
          lifestyle={lifestyle}
          langues={langues}
          hobbies={hobbies}
          onRemoveAxis={removeAxis}
          onClear={clear}
          onBack={() => setDetail()}
          tuto={tuto && ready}
          onDismissTuto={closeTuto}
        />
        <TeamChart
          className="dash-cell dash-cell--equipe"
          options={dimensions.equipe}
          {...chartProperties}
        />
        <StatusChart
          className="dash-cell dash-cell--statut"
          options={dimensions.statut}
          {...chartProperties}
        />
        <SportCard
          className="dash-cell dash-cell--sport"
          lifestyle={lifestyle}
          pressed={view === "sport"}
          onOpen={() => openDetail("sport")}
          ready={ready}
        />
        <ContactCard
          className="dash-cell dash-cell--contact"
          profil={profil}
          langues={langues}
          pressed={view === "contact"}
          onOpen={() => openDetail("contact")}
        />
        {/* Annonce le résultat d'un filtre aux lecteurs d'écran. */}
        <p className="visually-hidden" role="status">
          {active
            ? `${pluralProjets(matching.length)} trouvé${matching.length > 1 ? "s" : ""}`
            : ""}
        </p>
      </main>
      <AnimatePresence>
        {introVisible && (
          <IntroBoundary key="intro" onError={endIntro}>
            <IntroLoader
              projets={projetsReels}
              themes={themes}
              onDone={endIntro}
            />
          </IntroBoundary>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

export default DashboardApp;
