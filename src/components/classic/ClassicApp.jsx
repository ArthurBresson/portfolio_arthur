import { useCallback, useState } from "react";
import { AnimatePresence, MotionConfig } from "motion/react";
import SiteHeader from "../SiteHeader.jsx";
import ScrollToTop from "../ScrollToTop.jsx";
import Hero from "../sections/Hero.jsx";
import Projects from "../sections/Projects.jsx";
import Parcours from "../sections/Parcours.jsx";
import About from "../sections/About.jsx";
import Lifestyle from "../sections/Lifestyle.jsx";
import Contact from "../sections/Contact.jsx";
import TimelineChart from "./ClassicTimeline.jsx";
import ThemeChart from "./ClassicThemeChart.jsx";
import FilterSummary from "./FilterSummary.jsx";
import ProjectFilters from "./ProjectFilters.jsx";
import IntroLoader, { IntroBoundary } from "../dataviz/IntroLoader.jsx";
import {
  NO_FILTER,
  clearAxis,
  realProjets,
  setAxis,
  toggleFrom,
  visibleProjets,
} from "../../lib/filters.js";
import { shouldPlayIntro } from "../../lib/intro.js";
import { byStartDesc } from "../../lib/dates.js";
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
  savoirEtre,
  mentions,
} from "../../data/portfolio.js";

// Projets comptés par les graphiques et les filtres (sans cartes vides).
const projetsReels = realProjets(projets);

// Page unique. Tout le contenu vient de src/data/portfolio.js.
// Le filtre croisé { cadre, theme } vit ici : les deux graphiques du hero,
// le résumé et les chips de la grille le lisent et le modifient.
// reducedMotion="user" : les translations et zooms sont coupés si
// l'utilisateur a activé prefers-reduced-motion.
function ClassicApp() {
  const [filtre, setFiltre] = useState(NO_FILTER);
  const [introVisible, setIntroVisible] = useState(shouldPlayIntro);
  const endIntro = useCallback(() => setIntroVisible(false), []);

  // Graphiques : bascule, en lâchant l'autre axe si le résultat est vide.
  const toggleCadre = (id) =>
    setFiltre((current) => toggleFrom(projetsReels, current, "cadre", id));
  const toggleTheme = (id) =>
    setFiltre((current) => toggleFrom(projetsReels, current, "theme", id));
  const reset = () => setFiltre(NO_FILTER);

  // Chips : (axe, id) active, (axe) sans id désactive, () réinitialise.
  const changeFromChips = (axis, id) => {
    if (!axis) return reset();
    setFiltre((current) =>
      id ? setAxis(current, axis, id) : clearAxis(current, axis),
    );
  };

  const charts = (
    <>
      <TimelineChart
        parcours={parcours}
        cadres={cadres}
        filtre={filtre}
        onToggleCadre={toggleCadre}
      />
      <ThemeChart
        projets={projetsReels}
        themes={themes}
        filtre={filtre}
        onToggleTheme={toggleTheme}
      />
      <FilterSummary
        projets={projetsReels}
        cadres={cadres}
        themes={themes}
        competences={competences}
        filtre={filtre}
        onReset={reset}
      />
    </>
  );

  const filters = (
    <ProjectFilters
      projets={projetsReels}
      cadres={cadres}
      themes={themes}
      competences={competences}
      filtre={filtre}
      onChange={changeFromChips}
    />
  );

  return (
    <MotionConfig reducedMotion="user">
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>
      <SiteHeader nom={profil.nom} />
      <main id="contenu">
        <Hero profil={profil} charts={charts} />
        <Projects
          projets={visibleProjets(projets, filtre).toSorted(byStartDesc)}
          cadres={cadres}
          competences={competences}
          filters={filters}
        />
        <About presentation={profil.presentation} savoirEtre={savoirEtre} />
        <Parcours parcours={parcours} />
        <Lifestyle lifestyle={lifestyle} hobbies={hobbies} langues={langues} />
      </main>
      <Contact profil={profil} mentions={mentions} />
      <ScrollToTop />
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

export default ClassicApp;
