/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import Block from "../ui/Block.jsx";
import { useElementWidth } from "../../hooks/useElementWidth.js";
import { formatPeriod } from "../../lib/dates.js";
import {
  currentMonthIndex,
  formatDuration,
  monthIndex,
} from "../../lib/filters.js";

// Graphique 1 : frise du parcours. Deux lignes (formations, expériences)
// et un repère « aujourd'hui ».
// Les périodes qui ont un `cadre` sont des boutons : clic = filtre cadre.

// Libellés courts dessinés dans les barres (le détail est dans le relevé).
const SHORT = {
  utt: "Prépa UTT",
  iut: "BUT Info",
  spie: "SPIE",
  "conseil-utt": "Conseil UTT",
  evad: "Colo",
  crna: "CRNA",
  hager: "Hager",
};

const DOMAIN_START = monthIndex("2023-07");
const DOMAIN_END = monthIndex("2028-01"); // exclu : on voit toute l'année 2027
const MIN_WIDTH = 320; // en dessous, la frise défile dans son conteneur
const PAD_X = 8;
const BAR_H = 30;
const LANES = [
  { type: "formation", label: "Formation", labelY: 40, barY: 48 },
  { type: "experience", label: "Expériences", labelY: 100, barY: 108 },
];
// Sous la ligne des expériences, la place des libellés posés dessous.
const HEIGHT = 160;

const barSpring = { type: "spring", stiffness: 170, damping: 26, mass: 0.9 };

function TimelineChart({ parcours, cadres, filtre, onToggleCadre }) {
  const scrollReference = useRef(null);
  const inView = useInView(scrollReference, { once: true, amount: 0.3 });
  const measured = useElementWidth(scrollReference);
  const width = Math.max(measured, MIN_WIDTH);
  const [focused, setFocused] = useState();

  const today = currentMonthIndex();
  const monthW = (width - PAD_X * 2) / (DOMAIN_END - DOMAIN_START);
  const xOf = (index) => PAD_X + (index - DOMAIN_START) * monthW;

  // Sur mobile, la frise défile : on montre d'abord le présent (à droite).
  useEffect(() => {
    const element = scrollReference.current;
    if (element && element.scrollWidth > element.clientWidth) {
      element.scrollLeft = element.scrollWidth;
    }
  }, [measured]);

  const cadreLabel = (id) => cadres.find((cadre) => cadre.id === id)?.label;

  // Barres trop courtes pour leur nom : libellé hors de la barre, en
  // alternant dessous / dessus dans chaque ligne pour éviter les collisions
  // (dessous d'abord : au-dessus, le libellé de ligne prend la place).
  const outsideCount = new Map();
  const periods = parcours.map((item) => {
    const start = monthIndex(item.start);
    const end = item.end ? monthIndex(item.end) : today; // inclus
    const months = end - start + 1;
    const x = xOf(start);
    const w = Math.max(xOf(end + 1) - x, 6);
    const short = SHORT[item.id] ?? item.place;
    const showLabel = w > short.length * 6.6 + 14;
    let below = false;
    if (!showLabel) {
      const count = outsideCount.get(item.type) ?? 0;
      outsideCount.set(item.type, count + 1);
      below = count % 2 === 0;
    }
    return { ...item, x, w, months, short, showLabel, below };
  });

  const todayX = xOf(today) + monthW / 2;
  const years = [];
  for (let year = 2024; year <= 2027; year += 1) years.push(year);

  const focusedItem = periods.find((period) => period.id === focused);

  return (
    <Block className="chart-card">
      <header className="chart-head">
        <h2 className="chart-title">Mon parcours dans le temps</h2>
        <p className="chart-hint">
          Clique une barre colorée pour voir ses projets.
        </p>
      </header>

      <div className="timeline-frame">
        {/* Libellés de ligne hors du conteneur défilant : toujours visibles,
            même quand la frise est calée sur « aujourd'hui » (mobile). */}
        <div className="tl-lanes" aria-hidden="true">
          {LANES.map((lane) => (
            <span key={lane.type} style={{ "--lane-y": `${lane.labelY}px` }}>
              {lane.label}
            </span>
          ))}
        </div>
        <div className="timeline-scroll" ref={scrollReference}>
          <svg
            className="timeline-svg"
            width={width}
            height={HEIGHT}
            viewBox={`0 0 ${width} ${HEIGHT}`}
            role="group"
            aria-label="Frise du parcours, de 2023 à 2027"
          >
            {/* Graduations annuelles */}
            <g aria-hidden="true">
              {years.map((year) => {
                const x = xOf(year * 12);
                return (
                  <g key={year}>
                    <line
                      className="tl-grid"
                      x1={x}
                      x2={x}
                      y1={22}
                      y2={HEIGHT - 4}
                    />
                    <text className="tl-year" x={x + 4} y={14}>
                      {year}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Repère « aujourd'hui », derrière les barres pour ne pas
                couper leurs libellés. */}
            <g className="tl-today" aria-hidden="true">
              <line x1={todayX} x2={todayX} y1={22} y2={HEIGHT - 4} />
              <text x={todayX - 4} y={30} textAnchor="end">
                aujourd&apos;hui
              </text>
            </g>

            {/* Périodes */}
            {periods.map((period, index) => {
              const lane = LANES.find((item) => item.type === period.type);
              const clickable = Boolean(period.cadre);
              const pressed = clickable && filtre.cadre === period.cadre;
              const dimmed = filtre.cadre && !pressed;
              const label = `${period.title}, ${period.place}. ${formatPeriod(period.start, period.end)}, ${formatDuration(period.months)}.`;
              const interactiveProperties = clickable
                ? {
                    role: "button",
                    "aria-pressed": pressed,
                    "aria-label": `${label} Filtrer les projets ${cadreLabel(period.cadre)}.`,
                    onClick: () => onToggleCadre(period.cadre),
                    onKeyDown: (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onToggleCadre(period.cadre);
                      }
                    },
                  }
                : { role: "img", "aria-label": label };
              const classes = [
                "tl-item",
                clickable ? "tl-item--cadre" : "tl-item--plain",
                pressed && "is-active",
                dimmed && "is-dimmed",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <g
                  key={period.id}
                  className={classes}
                  tabIndex={clickable ? 0 : undefined}
                  onPointerEnter={() => setFocused(period.id)}
                  onPointerLeave={(event) => {
                    // Au toucher, pointerleave suit le tap : on garde le relevé.
                    if (event.pointerType !== "touch") setFocused();
                  }}
                  onFocus={() => setFocused(period.id)}
                  onBlur={() => setFocused()}
                  {...interactiveProperties}
                >
                  <motion.rect
                    className="tl-bar"
                    x={period.x}
                    y={lane.barY}
                    width={period.w}
                    height={BAR_H}
                    rx={Math.min(10, period.w / 2)}
                    style={{ originX: 0 }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: inView ? 1 : 0 }}
                    transition={{ ...barSpring, delay: 0.05 * index }}
                  />
                  {period.showLabel ? (
                    <text
                      className="tl-bar-label"
                      x={period.x + 8}
                      y={lane.barY + BAR_H / 2 + 4}
                      aria-hidden="true"
                    >
                      {period.short}
                    </text>
                  ) : (
                    <text
                      className="tl-bar-label tl-bar-label--outside"
                      x={period.x + period.w / 2}
                      y={period.below ? lane.barY + BAR_H + 13 : lane.barY - 5}
                      textAnchor="middle"
                      aria-hidden="true"
                    >
                      {period.short}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Relevé : rôle d'infobulle, lisible au clavier et jamais rogné. */}
      <p className="chart-readout" aria-live="polite">
        {focusedItem ? (
          <>
            <strong>{focusedItem.title}</strong>
            <span>
              {focusedItem.place} ·{" "}
              {formatPeriod(focusedItem.start, focusedItem.end)}
            </span>
            <span className="chart-readout-value tabular">
              {formatDuration(focusedItem.months)}
              {focusedItem.end === null && " (en cours)"}
            </span>
          </>
        ) : (
          <span className="chart-readout-idle">
            Touche ou survole une période pour voir sa durée.
          </span>
        )}
      </p>
    </Block>
  );
}

export default TimelineChart;
