/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { useEffect, useState } from "react";

const LINKS = [
  { href: "#projets", label: "Projets" },
  { href: "#parcours", label: "Parcours" },
  { href: "#hors-code", label: "Hors code" },
  { href: "#contact", label: "Contact" },
];

// Barre de navigation flottante en pilule. Elle prend du relief dès que la
// page défile, pour se détacher du contenu.
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
