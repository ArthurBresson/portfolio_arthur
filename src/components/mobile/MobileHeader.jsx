/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll } from "motion/react";
import Button from "../ui/Button.jsx";
import { DownloadIcon, SocialIcon } from "../ui/Icons.jsx";

// Barre du haut de la version mobile : monogramme et nom à gauche, bouton
// burger à droite, et un fil de lecture qui avance avec la page. Le burger
// ouvre un menu plein écran : les sections numérotées, puis l'email, le CV
// et les réseaux.
// Accessibilité : le bouton annonce l'état (aria-expanded), Échap et un
// lien choisi ferment le menu, le focus revient au bouton, et la page
// derrière ne défile plus tant que le menu est ouvert.
const panel = {
  initial: { opacity: 0, y: -12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};
const panelSpring = { type: "spring", stiffness: 320, damping: 32 };

function MobileHeader({ profil, sections }) {
  const { nom, email, cv, socials = [] } = profil;
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const buttonReference = useRef(null);
  const firstLinkReference = useRef(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const button = buttonReference.current;
    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    firstLinkReference.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    globalThis.addEventListener("keydown", onKey);
    return () => {
      body.style.overflow = previous;
      globalThis.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  const initials = nom
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <header className={`m-header${isScrolled || open ? " is-scrolled" : ""}`}>
      <div className="m-bar">
        <a
          href="#accueil"
          className="site-brand"
          aria-label={`${nom}, haut de page`}
          onClick={() => setOpen(false)}
        >
          <span className="site-monogram" aria-hidden="true">
            {initials}
          </span>
          <span className="site-brand-name">{nom}</span>
        </a>
        <button
          ref={buttonReference}
          type="button"
          className="m-burger"
          aria-expanded={open}
          aria-controls="m-menu"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((current) => !current)}
        >
          <span className="m-burger-lines" aria-hidden="true" />
        </button>
      </div>
      <motion.span
        className="m-progress"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />

      <AnimatePresence>
        {open && (
          <motion.nav
            id="m-menu"
            className="m-menu"
            aria-label="Navigation principale"
            {...panel}
            transition={panelSpring}
          >
            <ol className="m-menu-list">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    ref={index === 0 ? firstLinkReference : undefined}
                    href={`#${section.id}`}
                    className="m-menu-link"
                    onClick={() => setOpen(false)}
                  >
                    <span className="m-menu-number tabular">
                      {section.number}
                    </span>
                    {section.label}
                  </a>
                </li>
              ))}
            </ol>
            <div className="m-menu-foot">
              {email && (
                <a href={`mailto:${email}`} className="m-menu-email">
                  {email}
                </a>
              )}
              <div className="m-menu-socials">
                {cv && (
                  <Button
                    href={cv}
                    download
                    variant="soft"
                    size="sm"
                    icon={<DownloadIcon />}
                  >
                    Mon CV
                  </Button>
                )}
                {socials.map((social) => (
                  <Button
                    key={social.url}
                    href={social.url}
                    external
                    variant="soft"
                    size="sm"
                    icon={<SocialIcon label={social.label} />}
                  >
                    {social.label}
                  </Button>
                ))}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export default MobileHeader;
