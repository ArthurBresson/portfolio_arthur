/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { useEffect, useState } from "react";
import AnimatedIcon from "./ui/AnimatedIcon.jsx";

const LINKS = [
  { href: "#projets", label: "Projets", icon: "code" },
  { href: "#parcours", label: "Parcours", icon: "suitcase" },
  { href: "#hors-code", label: "Hors code", icon: "cup" },
  { href: "#contact", label: "Contact", icon: "mail" },
];

// Barre de navigation flottante. Un filet fin l'entoure dès que la page
// défile, pour la détacher du contenu. Chaque lien a son icône Lordicon,
// jouée au survol ou au focus.
function SiteHeader({ nom }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const initials = nom
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`.trim()}>
      <nav className="site-nav" aria-label="Navigation principale">
        <a
          href="#accueil"
          className="site-brand"
          aria-label={`${nom}, haut de page`}
        >
          <span className="site-monogram" aria-hidden="true">
            {initials}
          </span>
          <span className="site-brand-name">{nom}</span>
        </a>
        <ul className="site-links">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="site-link">
                <AnimatedIcon name={link.icon} size={22} target="a" />
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default SiteHeader;
