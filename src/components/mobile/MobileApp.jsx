import { useState } from "react";
import { MotionConfig } from "motion/react";
import MobileHeader from "./MobileHeader.jsx";
import ThemeFilter from "./ThemeFilter.jsx";
import Button from "../ui/Button.jsx";
import Hero from "../sections/Hero.jsx";
import Projects from "../sections/Projects.jsx";
import Parcours from "../sections/Parcours.jsx";
import About from "../sections/About.jsx";
import Lifestyle from "../sections/Lifestyle.jsx";
import Contact from "../sections/Contact.jsx";
import { realProjets } from "../../lib/filters.js";
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

// Projets publiés, du plus récent au plus ancien. Les cartes « Bientôt en
// ligne » ne sont pas montrées sur téléphone : elles prenaient un écran
// entier pour ne rien dire.
const projetsReels = realProjets(projets).toSorted(byStartDesc);

// Sections numérotées, dans l'ordre de la page ; le menu burger les reprend.
const SECTIONS = [
  { id: "a-propos", number: "01", label: "À propos" },
  { id: "projets", number: "02", label: "Projets" },
  { id: "parcours", number: "03", label: "Parcours" },
  { id: "hors-code", number: "04", label: "Hors code" },
  { id: "contact", number: "05", label: "Contact" },
];
const numberOf = (id) => SECTIONS.find((section) => section.id === id).number;

// Sans filtre, seuls les projets les plus récents s'affichent d'abord.
const FIRST_PROJECTS = 6;

// Version téléphone : une page qui défile, sans graphiques (ils sont
// réservés au dashboard sur ordinateur). Accueil, puis cinq sections
// numérotées. Tout le contenu vient de src/data/portfolio.js.
function MobileApp() {
  const [theme, setTheme] = useState();
  const [showAll, setShowAll] = useState(false);
  const filtered = theme
    ? projetsReels.filter((projet) => projet.themes.includes(theme))
    : projetsReels;
  const visibles =
    theme || showAll ? filtered : filtered.slice(0, FIRST_PROJECTS);
  const hidden = filtered.length - visibles.length;

  return (
    <MotionConfig reducedMotion="user">
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>
      <MobileHeader profil={profil} sections={SECTIONS} />
      <main id="contenu">
        <Hero profil={profil} />
        <About
          number={numberOf("a-propos")}
          presentation={profil.presentation}
          savoirEtre={savoirEtre}
          parcours={parcours}
        />
        <Projects
          number={numberOf("projets")}
          projets={visibles}
          cadres={cadres}
          competences={competences}
          more={
            hidden > 0 && (
              <Button
                variant="soft"
                className="m-more"
                onClick={() => setShowAll(true)}
              >
                Afficher les {hidden} autres projets
              </Button>
            )
          }
          filters={
            <ThemeFilter
              projets={projetsReels}
              themes={themes}
              value={theme}
              onChange={setTheme}
            />
          }
        />
        <Parcours number={numberOf("parcours")} parcours={parcours} />
        <Lifestyle
          number={numberOf("hors-code")}
          lifestyle={lifestyle}
          hobbies={hobbies}
          langues={langues}
        />
      </main>
      <Contact
        number={numberOf("contact")}
        profil={profil}
        mentions={mentions}
      />
    </MotionConfig>
  );
}

export default MobileApp;
