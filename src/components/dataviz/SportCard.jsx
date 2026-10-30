/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { motion, useReducedMotion } from "motion/react";
import AnimatedIcon from "../ui/AnimatedIcon.jsx";
import Block from "../ui/Block.jsx";
import Badge from "../ui/Badge.jsx";
import { toMinutes } from "../../lib/dates.js";

// Case sport : progression sur triathlon M (pente qui descend = plus
// rapide) et chronos de course à pied. Toute la case est un bouton qui
// ouvre la vue sport au centre.

const W = 220;
const H = 64;
const PAD = 12;

function SportCard({
  lifestyle,
  pressed,
  onOpen,
  ready,
  className = "",
  ...rest
}) {
  const reduce = useReducedMotion();
  const triathlon = lifestyle.find((item) => item.id === "triathlon");
  const cap = lifestyle.find((item) => item.id === "cap");
  const races = (triathlon?.courses ?? []).filter(
    (race) => race.format === "M",
  );
  const [first, last] = [races[0], races.at(-1)];
  const gain =
    first && last ? toMinutes(first.temps) - toMinutes(last.temps) : 0;

  const x1 = PAD + 30;
  const x2 = W - PAD - 30;
  const y1 = PAD + 6;
  const y2 = H - PAD - 6;

  return (
    <Block
      as="button"
      type="button"
      interactive
      className={`chart-card sport-card ${className}`.trim()}
      aria-pressed={pressed}
      aria-label={`Sport : triathlon M de ${first?.temps} à ${last?.temps}, ${gain} minutes gagnées. Ouvrir le détail.`}
      onClick={onOpen}
      {...rest}
    >
      <header className="chart-head">
        <h2 className="chart-title chart-title--icon">
          <AnimatedIcon name="cup" size={20} target=".sport-card" />
          Sport
        </h2>
        <p className="chart-hint">
          Triathlon M, deux courses. Clique pour le détail.
        </p>
      </header>
      <div className="chart-body sport-body" aria-hidden="true">
        {first && last && (
          <div className="sport-slope">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
              <motion.line
                className="slope-line"
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: ready ? 1 : 0 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.2 }
                }
              />
              <circle className="slope-dot" cx={x1} cy={y1} r="4.5" />
              <circle
                className="slope-dot slope-dot--best"
                cx={x2}
                cy={y2}
                r="5.5"
              />
              <text
                className="slope-time"
                x={x1}
                y={y1 + 18}
                textAnchor="middle"
              >
                {first.temps}
              </text>
              <text
                className="slope-place"
                x={x1}
                y={y1 - 8}
                textAnchor="middle"
              >
                {first.lieu}
              </text>
              <text
                className="slope-time slope-time--best"
                x={x2}
                y={y2 + 18}
                textAnchor="middle"
              >
                {last.temps}
              </text>
              <text
                className="slope-place"
                x={x2}
                y={y2 - 10}
                textAnchor="middle"
              >
                {last.lieu}
              </text>
            </svg>
            {gain > 0 && <Badge className="slope-gain">−{gain} min</Badge>}
          </div>
        )}
        <dl className="sport-chronos">
          {(cap?.stats ?? []).map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd className="text-gold tabular">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Block>
  );
}

export default SportCard;
