/* eslint-disable react/prop-types -- React 19 n'exploite plus les propTypes */
import { Component, Suspense, lazy, useEffect, useRef, useState } from "react";
import CanvasNetwork from "./CanvasNetwork.jsx";
import { createNetworkEngine } from "./networkEngine.js";
import { useActiveSection } from "./useActiveSection.js";
import { useMediaQuery } from "./useMediaQuery.js";
import "../../styles/hero.css";

// Hero du portfolio : réseau de neurones interactif dont les neurones
// d'entrée (une bulle par section) se réorganisent au scroll en navbar.
//
//   - Les bulles et le nœud central (photo) sont de vrais éléments DOM,
//     positionnés par le moteur partagé (networkEngine.js).
//   - Le renderer (Three.js sur desktop, Canvas 2D sur mobile) dessine
//     dessous les liaisons, impulsions, halos et particules.
//   - Three.js est chargé en lazy : le mobile ne le télécharge jamais.

const ThreeNetwork = lazy(() => import("./ThreeNetwork.jsx"));

const COMPACT_QUERY = "(max-width: 768px), (pointer: coarse)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// Si WebGL échoue (pas de contexte, pilote bloqué…), on retombe sur le Canvas 2D.
class RendererBoundary extends Component {
  constructor(properties) {
    super(properties);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function CoreNode({ photo, name }) {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(photo) && !failed;
  return showPhoto ? (
    <img
      className="ab-core__photo"
      src={photo}
      alt={`Photo de ${name}`}
      width="512"
      height="512"
      decoding="async"
      draggable="false"
      onError={() => setFailed(true)}
    />
  ) : (
    <span className="ab-core__initials" aria-hidden="true">
      {getInitials(name)}
    </span>
  );
}

/**
 * @param {object} props
 * @param {object} props.profile  Objet `arthurBresson` (src/data/arthurBresson.js).
 * @param {"auto"|"three"|"canvas"} [props.renderer="auto"]
 *   "auto" : Three.js sur desktop, Canvas 2D sur mobile / pointeur tactile.
 */
export default function NeuralHero({ profile, renderer = "auto" }) {
  const { sections } = profile;
  const [engine] = useState(() => createNetworkEngine(sections));
  const activeId = useActiveSection(sections.map((section) => section.id));
  const activeIndex = sections.findIndex((section) => section.id === activeId);
  const compact = useMediaQuery(COMPACT_QUERY);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);

  const heroReference = useRef(null);
  const stageReference = useRef(null);
  const navReference = useRef(null);
  const bandReference = useRef(null);
  const brandReference = useRef(null);
  const coreReference = useRef(null);
  const spacerReference = useRef(null);

  useEffect(() => {
    engine.mount({
      hero: heroReference.current,
      stage: stageReference.current,
      nav: navReference.current,
      band: bandReference.current,
      brand: brandReference.current,
      core: coreReference.current,
      spacer: spacerReference.current,
    });
    return () => engine.unmount();
  }, [engine]);

  useEffect(() => {
    engine.setReducedMotion(reducedMotion);
  }, [engine, reducedMotion]);

  useEffect(() => {
    engine.setActive(activeIndex);
  }, [engine, activeIndex]);

  const scrollToSection = (event, id) => {
    const target = document.querySelector(`#${CSS.escape(id)}`);
    if (!target) return; // ancre native si la section n'existe pas
    event.preventDefault();
    const top =
      target.getBoundingClientRect().top +
      globalThis.scrollY -
      engine.getNavOffset();
    globalThis.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
    globalThis.history.replaceState(undefined, "", `#${id}`);
  };

  const mode = renderer === "auto" ? (compact ? "canvas" : "three") : renderer;
  const canvasRenderer = <CanvasNetwork engine={engine} />;

  return (
    <>
      <header ref={heroReference} className="ab-hero">
        <div className="ab-hero__intro ab-glass">
          <div className="ab-hero__heading">
            <h1 className="ab-hero__name">{profile.nom}</h1>
            <p className="ab-hero__title">{profile.titrePro}</p>
          </div>
          <div className="ab-hero__about">
            <p className="ab-hero__tagline">{profile.tagline}</p>
            {profile.socials?.length > 0 && (
              <ul className="ab-hero__socials">
                {profile.socials.map((social) => (
                  <li key={social.url}>
                    <a
                      className="ab-hero__social"
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Zone réservée au réseau : le CSS décide de sa place, le moteur la mesure. */}
        <div
          ref={stageReference}
          className="ab-hero__stage"
          aria-hidden="true"
        />
        {sections.length > 0 && (
          <a
            className="ab-hero__scroll"
            href={`#${sections[0].id}`}
            onClick={(event) => scrollToSection(event, sections[0].id)}
          >
            Explorer
            <span className="ab-hero__scroll-line" aria-hidden="true" />
          </a>
        )}
      </header>

      {mode === "three" ? (
        <RendererBoundary fallback={canvasRenderer}>
          <Suspense fallback={canvasRenderer}>
            <ThreeNetwork engine={engine} />
          </Suspense>
        </RendererBoundary>
      ) : (
        canvasRenderer
      )}

      {/* Le nom est du simple texte, hors réseau : il apparaît avec le bandeau. */}
      <div ref={bandReference} className="ab-nav-band" aria-hidden="true">
        <span ref={brandReference} className="ab-nav-band__name">
          {profile.nom}
        </span>
      </div>

      <div ref={coreReference} className="ab-core">
        <CoreNode photo={profile.photo} name={profile.nom} />
      </div>

      <nav
        ref={navReference}
        className="ab-bubbles"
        aria-label="Sections du portfolio"
      >
        <ul className="ab-bubbles__list">
          {sections.map((section, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={section.id}>
                <a
                  ref={(element) => engine.setBubble(index, element)}
                  className={`ab-bubble${isActive ? " is-active" : ""}`}
                  href={`#${section.id}`}
                  style={{ "--section-accent": section.accent, "--i": index }}
                  aria-current={isActive ? "location" : undefined}
                  onClick={(event) => scrollToSection(event, section.id)}
                  onPointerEnter={() => engine.setHover(index)}
                  onPointerLeave={() => engine.setHover(-1)}
                  onFocus={() => engine.setHover(index)}
                  onBlur={() => engine.setHover(-1)}
                >
                  <span className="ab-bubble__body">
                    <span className="ab-bubble__dot" aria-hidden="true" />
                    {section.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
        <div
          ref={spacerReference}
          className="ab-bubbles__spacer"
          aria-hidden="true"
        />
      </nav>
    </>
  );
}
