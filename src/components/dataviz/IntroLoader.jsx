/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { Component, useEffect, useState } from "react";
import { motion } from "motion/react";
import { currentMonthIndex, monthIndex } from "../../lib/filters.js";
import { markIntroSeen } from "../../lib/intro.js";

// Loader d'intro (~1,5 s) : les mini-cartes des projets apparaissent, puis
// chacune vole vers la barre de son thème. À l'atterrissage, un point se
// pose sur la frise et les barres de ses thèmes grandissent.
// Clic ou touche = on passe. Filet de sécurité : un minuteur JS (2 s) et
// une animation CSS (.intro-loader) masquent l'écran quoi qu'il arrive.

const STAGE_H = 312;
const FRISE_Y = 170;
const BASELINE = 290;
const BAR_MAX_H = 92;

const APPEAR_STAGGER = 0.03; // s
const GATHER_AT = 480; // ms
const FLIGHT_STAGGER = 40; // ms
const FLIGHT_TIME = 300; // ms, avant que la barre ne réagisse
const HOLD = 260; // ms après le dernier atterrissage
const HARD_CAP = 2000; // ms

const appearSpring = { type: "spring", stiffness: 380, damping: 28, mass: 0.7 };
const flightSpring = { type: "spring", stiffness: 210, damping: 27, mass: 0.8 };
const growSpring = { type: "spring", stiffness: 300, damping: 26, mass: 0.7 };

// Pseudo-aléatoire stable (pas de Math.random : rendu identique à chaque fois).
const jitter = (index, amplitude) =>
  (((index * 37 + 11) % 17) / 16 - 0.5) * 2 * amplitude;

function stageWidth() {
  return Math.min(440, (window.innerWidth || 375) - 32);
}

function IntroLoader({ projets, themes, onDone }) {
  const [width] = useState(stageWidth);
  const [phase, setPhase] = useState("scatter");
  const [landed, setLanded] = useState(0);

  const ordered = projets.toSorted((a, b) => a.start.localeCompare(b.start));
  const total = ordered.length;

  // Séquence : dispersion -> envol -> atterrissages -> fin.
  useEffect(() => {
    markIntroSeen();
    const timers = [setTimeout(() => setPhase("gather"), GATHER_AT)];
    for (let index = 0; index < total; index += 1) {
      timers.push(
        setTimeout(
          () => setLanded(index + 1),
          GATHER_AT + index * FLIGHT_STAGGER + FLIGHT_TIME,
        ),
      );
    }
    const end = GATHER_AT + (total - 1) * FLIGHT_STAGGER + FLIGHT_TIME + HOLD;
    timers.push(setTimeout(onDone, Math.min(end, HARD_CAP)));
    return () => {
      for (const timer of timers) clearTimeout(timer);
    };
  }, [total, onDone]);

  // Passer l'intro : n'importe quel clic, toucher ou touche.
  useEffect(() => {
    const skip = () => onDone();
    globalThis.addEventListener("pointerdown", skip);
    globalThis.addEventListener("keydown", skip);
    return () => {
      globalThis.removeEventListener("pointerdown", skip);
      globalThis.removeEventListener("keydown", skip);
    };
  }, [onDone]);

  // Géométrie
  const columns = 4;
  const slot = width / columns;
  const cardW = Math.min(96, slot - 8);
  const barSlot = width / themes.length;
  const barW = Math.min(34, barSlot - 14);
  const barCenter = (themeId) =>
    themes.findIndex((theme) => theme.id === themeId) * barSlot + barSlot / 2;

  const start = monthIndex(ordered[0]?.start ?? "2024-01");
  const span = Math.max(1, currentMonthIndex() - start + 1);
  const friseX = (value) =>
    6 + ((monthIndex(value) - start) / span) * (width - 12);

  const counts = Object.fromEntries(themes.map((theme) => [theme.id, 0]));
  for (const projet of ordered.slice(0, landed)) {
    for (const theme of projet.themes) counts[theme] += 1;
  }
  const finalMax = Math.max(
    1,
    ...themes.map(
      (theme) =>
        ordered.filter((projet) => projet.themes.includes(theme.id)).length,
    ),
  );

  return (
    <motion.div
      className="intro-loader"
      aria-hidden="true"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] },
      }}
    >
      <div className="intro-stage" style={{ width, height: STAGE_H }}>
        {/* Frise */}
        <span className="intro-frise" style={{ top: FRISE_Y }} />
        {ordered.slice(0, landed).map((projet) => (
          <motion.span
            key={`dot-${projet.id}`}
            className="intro-dot"
            style={{ left: friseX(projet.start) - 4, top: FRISE_Y - 4 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={growSpring}
          />
        ))}

        {/* Barres par thème */}
        {themes.map((theme, index) => (
          <motion.span
            key={theme.id}
            className="intro-bar"
            style={{
              left: index * barSlot + (barSlot - barW) / 2,
              width: barW,
              top: BASELINE,
            }}
            initial={{ height: 4, y: -4 }}
            animate={{
              height: 4 + (counts[theme.id] / finalMax) * BAR_MAX_H,
              y: -(4 + (counts[theme.id] / finalMax) * BAR_MAX_H),
            }}
            transition={growSpring}
          />
        ))}

        {/* Mini-cartes */}
        {ordered.map((projet, index) => {
          const column = index % columns;
          const row = Math.floor(index / columns);
          const x0 = column * slot + (slot - cardW) / 2 + jitter(index, 6);
          const y0 = 10 + row * 44 + jitter(index + 3, 5);
          const target = barCenter(projet.themes[0]);
          const flying = phase === "gather";
          const delay = (index * FLIGHT_STAGGER) / 1000;
          return (
            <motion.span
              key={projet.id}
              className="intro-card"
              style={{ width: cardW }}
              initial={{ x: x0, y: y0 + 14, opacity: 0, scale: 0.9, rotate: 0 }}
              animate={
                flying
                  ? {
                      x: target - cardW / 2,
                      y: BASELINE - 40,
                      opacity: 0,
                      scale: 0.3,
                      rotate: 0,
                    }
                  : {
                      x: x0,
                      y: y0,
                      opacity: 1,
                      scale: 1,
                      rotate: jitter(index + 7, 3),
                    }
              }
              transition={
                flying
                  ? {
                      default: { ...flightSpring, delay },
                      opacity: { duration: 0.12, delay: delay + 0.2 },
                    }
                  : { ...appearSpring, delay: index * APPEAR_STAGGER }
              }
            >
              {projet.title}
            </motion.span>
          );
        })}
      </div>
      <p className="intro-skip">Cliquez pour passer</p>
    </motion.div>
  );
}

// Si le loader plante, il disparaît : la page reste lisible.
export class IntroBoundary extends Component {
  constructor(properties) {
    super(properties);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    return this.state.failed ? undefined : this.props.children;
  }
}

export default IntroLoader;
