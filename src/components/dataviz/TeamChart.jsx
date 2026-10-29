/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { motion, useReducedMotion } from "motion/react";
import ChartCard from "./ChartCard.jsx";
import {
  optionCounts,
  othersActive,
  pluralProjets,
} from "../../lib/filters.js";

// Seul, en binôme ou en équipe : anneau découpé selon le total, la part
// pleine de chaque segment suit les autres filtres. La légende porte les
// boutons (focusables) ; un clic sur l'anneau fait la même chose.

const R = 38;
const C = 2 * Math.PI * R;
const GAP = 3;
const TONES = [1, 0.72, 0.48]; // intensité de l'accent doux par segment

const arcSpring = { type: "spring", stiffness: 160, damping: 24, mass: 0.9 };

function TeamChart({ projets, options, filtre, onToggle, ready, ...rest }) {
  const reduce = useReducedMotion();
  const ghost = othersActive(filtre, "equipe");
  const segments = options.map((option) => ({
    ...option,
    ...optionCounts(projets, filtre, "equipe", option.id),
  }));
  const sum = Math.max(
    1,
    segments.reduce((total, segment) => total + segment.total, 0),
  );

  // Début de chaque segment = somme des longueurs précédentes.
  const lengths = segments.map((segment) => (segment.total / sum) * C);
  const arcs = segments.map((segment, index) => ({
    ...segment,
    tone: TONES[index] ?? 0.4,
    start: lengths.slice(0, index).reduce((total, length) => total + length, 0),
    track: Math.max(0, lengths[index] - GAP),
    fill: Math.max(0, (segment.value / sum) * C - GAP),
  }));

  return (
    <ChartCard
      title="Seul ou en équipe"
      hint="Taille de l'équipe par projet."
      {...rest}
    >
      <div className="team-chart">
        <svg
          className="team-donut"
          viewBox="0 0 100 100"
          aria-hidden="true"
          focusable="false"
        >
          <circle className="team-base" cx="50" cy="50" r={R} />
          {arcs.map((arc) => {
            const pressed = filtre.equipe === arc.id;
            return (
              <g
                key={arc.id}
                className={`team-arc${pressed ? " is-active" : ""}`}
                style={{ "--tone": arc.tone }}
                onClick={() => onToggle("equipe", arc.id)}
              >
                <circle
                  className="team-arc-ghost"
                  cx="50"
                  cy="50"
                  r={R}
                  strokeDasharray={`${arc.track} ${C}`}
                  strokeDashoffset={-arc.start}
                  opacity={ghost ? 1 : 0}
                />
                <motion.circle
                  className="team-arc-fill"
                  cx="50"
                  cy="50"
                  r={R}
                  strokeDashoffset={-arc.start}
                  initial={{ strokeDasharray: `0 ${C}` }}
                  animate={{
                    strokeDasharray: `${ready ? arc.fill : 0} ${C}`,
                  }}
                  transition={reduce ? { duration: 0 } : arcSpring}
                />
              </g>
            );
          })}
        </svg>
        <ul className="team-legend">
          {arcs.map((arc) => (
            <li key={arc.id}>
              <button
                type="button"
                className={`legend-row${arc.value === 0 ? " is-empty" : ""}`}
                style={{ "--tone": arc.tone }}
                aria-pressed={filtre.equipe === arc.id}
                aria-label={`${arc.label} : ${pluralProjets(arc.value)}. Filtrer.`}
                onClick={() => onToggle("equipe", arc.id)}
              >
                <span className="legend-dot" aria-hidden="true" />
                <span className="legend-label">{arc.label}</span>
                <span className="legend-value tabular" aria-hidden="true">
                  {arc.value}
                  {ghost && <span className="ghost-total">/{arc.total}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  );
}

export default TeamChart;
