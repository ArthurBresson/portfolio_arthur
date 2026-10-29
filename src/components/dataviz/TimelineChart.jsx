/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { useRef, useState } from "react";
import { motion } from "motion/react";
import ChartCard from "./ChartCard.jsx";
import {
  useElementHeight,
  useElementWidth,
} from "../../hooks/useElementWidth.js";
import { formatPeriod } from "../../lib/dates.js";
import {
  currentMonthIndex,
  formatDuration,
  isActive,
  matches,
  monthIndex,
} from "../../lib/filters.js";

// Frise du parcours, version compacte pour une case du dashboard.
// Ligne du haut : formations. Ligne du milieu : expériences. En bas, un
// point par projet. Pointillé rouge : aujourd'hui. Les périodes qui ont
// un `cadre` sont des boutons : clic = filtre cadre. Le détail de la
// période survolée s'affiche dans la ligne d'aide.

// Libellés courts dessinés dans ou près des barres.
const SHORT = {
  bac: "Bac",
  utt: "UTT",
  iut: "BUT Info",
  spie: "SPIE",
  "conseil-utt": "Conseil UTT",
  evad: "Colo",
  crna: "CRNA",
  hager: "Hager",
};

const DOMAIN_START = monthIndex("2020-07");
const DOMAIN_END = monthIndex("2028-01"); // exclu : on voit toute l'année 2027
const MIN_WIDTH = 280; // en dessous, la frise défile dans son conteneur
const PAD_X = 4;
const BAR_H = 20;
// Hors-barre, la ligne formation pose ses libellés dessous ; la ligne
// expériences alterne dessus / dessous pour éviter les collisions.
const LANES = {
  formation: { barY: 18, outside: ["below"] },
  experience: { barY: 60, outside: ["above", "below"] },
};
// Les points projets se posent en bas de la frise, sous les libellés
// « dessous » des expériences (y ≈ 91) quand la case est assez haute.
// La hauteur suit la case : rien n'est coupé sur un petit écran.
const DOT_STEP = 8;
const MAX_HEIGHT = 130;
const MIN_HEIGHT = 100;
// Largeur moyenne d'un caractère des libellés (12 px, graisse 600).
const CHAR_W = 7;

const barSpring = { type: "spring", stiffness: 170, damping: 26, mass: 0.9 };

function TimelineChart({
  parcours,
  projets,
  cadres,
  filtre,
  onToggle,
  ready,
  ...rest
}) {
  const scrollReference = useRef(null);
  const measured = useElementWidth(scrollReference, 320);
  const width = Math.max(measured, MIN_WIDTH);
  const available = useElementHeight(scrollReference, MAX_HEIGHT);
  const height = Math.min(Math.max(available, MIN_HEIGHT), MAX_HEIGHT);
  const dotsY = height - 6;
  const [focused, setFocused] = useState();

  const today = currentMonthIndex();
  const monthW = (width - PAD_X * 2) / (DOMAIN_END - DOMAIN_START);
  const xOf = (index) => PAD_X + (index - DOMAIN_START) * monthW;

  const cadreLabel = (id) => cadres.find((cadre) => cadre.id === id)?.label;

  const outsideCount = new Map();
  const periods = parcours.map((item) => {
    const start = monthIndex(item.start);
    const end = item.end ? monthIndex(item.end) : today; // inclus
    const months = end - start + 1;
    const x = xOf(start);
    const w = Math.max(xOf(end + 1) - x, 5);
    const short = SHORT[item.id] ?? item.place;
    const inside = w > short.length * CHAR_W + 12;
    let side;
    if (!inside) {
      const choices = LANES[item.type].outside;
      const count = outsideCount.get(item.type) ?? 0;
      outsideCount.set(item.type, count + 1);
      side = choices[count % choices.length];
    }
    return { ...item, x, w, months, short, inside, side };
  });

  // Points projets : empilés quand plusieurs commencent le même mois.
  const stacks = new Map();
  const dots = projets.map((projet) => {
    const index = monthIndex(projet.start);
    const level = stacks.get(index) ?? 0;
    stacks.set(index, level + 1);
    return {
      ...projet,
      cx: xOf(index) + monthW / 2,
      cy: dotsY - level * DOT_STEP,
    };
  });

  const active = isActive(filtre);
  const todayX = xOf(today) + monthW / 2;
  const years = [];
  for (let year = 2021; year <= 2027; year += 1) years.push(year);

  const focusedItem = periods.find((period) => period.id === focused);
  const hint = focusedItem
    ? `${focusedItem.short} · ${formatPeriod(focusedItem.start, focusedItem.end)} · ${formatDuration(focusedItem.months)}${focusedItem.end === null ? " (en cours)" : ""}`
    : "Clique une barre colorée pour filtrer. Pointillé : aujourd'hui.";

  return (
    <ChartCard title="Mon parcours" hint={hint} {...rest}>
      <div className="timeline-scroll" ref={scrollReference}>
        <svg
          className="timeline-svg"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="group"
          aria-label="Frise du parcours, de 2020 à 2027"
        >
          <g aria-hidden="true">
            {years.map((year) => {
              const x = xOf(year * 12);
              return (
                <g key={year}>
                  <line className="tl-grid" x1={x} x2={x} y1={13} y2={height} />
                  <text className="tl-year" x={x + 3} y={9}>
                    {year}
                  </text>
                </g>
              );
            })}
          </g>

          {periods.map((period, index) => {
            const lane = LANES[period.type];
            const clickable = Boolean(period.cadre);
            const pressed = clickable && filtre.cadre === period.cadre;
            const dimmed = filtre.cadre && !pressed;
            const label = `${period.title}, ${period.place}. ${formatPeriod(period.start, period.end)}, ${formatDuration(period.months)}.`;
            const interactiveProperties = clickable
              ? {
                  role: "button",
                  "aria-pressed": pressed,
                  "aria-label": `${label} Filtrer les projets ${cadreLabel(period.cadre)}.`,
                  onClick: () => onToggle("cadre", period.cadre),
                  onKeyDown: (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onToggle("cadre", period.cadre);
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
            const labelY = period.inside
              ? lane.barY + BAR_H / 2 + 4
              : period.side === "above"
                ? lane.barY - 4
                : lane.barY + BAR_H + 11;

            return (
              <g
                key={period.id}
                className={classes}
                tabIndex={0}
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
                  rx={Math.min(8, period.w / 2)}
                  style={{ originX: 0 }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: ready ? 1 : 0 }}
                  transition={{ ...barSpring, delay: 0.05 * index }}
                />
                <text
                  className={`tl-bar-label${period.inside ? "" : " tl-bar-label--outside"}`}
                  x={period.inside ? period.x + 7 : period.x + period.w / 2}
                  y={labelY}
                  textAnchor={period.inside ? "start" : "middle"}
                  aria-hidden="true"
                >
                  {period.short}
                </text>
              </g>
            );
          })}

          <g aria-hidden="true">
            {dots.map((dot, index) => {
              const state = active
                ? matches(dot, filtre)
                  ? "is-match"
                  : "is-dimmed"
                : "";
              return (
                <motion.circle
                  key={dot.id}
                  className={`tl-dot ${state}`.trim()}
                  cx={dot.cx}
                  cy={dot.cy}
                  r={3.5}
                  initial={{ scale: 0 }}
                  animate={{ scale: ready ? 1 : 0 }}
                  transition={{ ...barSpring, delay: 0.4 + 0.03 * index }}
                >
                  <title>{dot.title}</title>
                </motion.circle>
              );
            })}
          </g>

          <line
            className="tl-today"
            x1={todayX}
            x2={todayX}
            y1={13}
            y2={height}
            aria-hidden="true"
          />
        </svg>
      </div>
    </ChartCard>
  );
}

export default TimelineChart;
