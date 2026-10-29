/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { motion, useReducedMotion } from "motion/react";
import ChartCard from "./ChartCard.jsx";
import { barSpring } from "../ui/motionPresets.js";
import {
  optionCounts,
  othersActive,
  pluralProjets,
} from "../../lib/filters.js";

// Livrés / en cours : deux tuiles cliquables et une barre de répartition.
function StatusChart({ projets, options, filtre, onToggle, ready, ...rest }) {
  const reduce = useReducedMotion();
  const ghost = othersActive(filtre, "statut");
  const tiles = options.map((option) => ({
    ...option,
    ...optionCounts(projets, filtre, "statut", option.id),
  }));
  const sum = Math.max(
    1,
    tiles.reduce((total, tile) => total + tile.value, 0),
  );

  return (
    <ChartCard
      title="Livrés ou en cours"
      hint="Ce qui tourne encore aujourd'hui."
      {...rest}
    >
      <div className="status-chart">
        <div className="status-tiles">
          {tiles.map((tile) => (
            <button
              key={tile.id}
              type="button"
              className={`status-tile status-tile--${tile.id}${tile.value === 0 ? " is-empty" : ""}`}
              aria-pressed={filtre.statut === tile.id}
              aria-label={`${tile.label} : ${pluralProjets(tile.value)}. Filtrer.`}
              onClick={() => onToggle("statut", tile.id)}
            >
              <span className="status-value tabular" aria-hidden="true">
                {tile.value}
                {ghost && <span className="ghost-total">/{tile.total}</span>}
              </span>
              <span className="status-label">{tile.label}</span>
            </button>
          ))}
        </div>
        <div className="status-split" aria-hidden="true">
          {tiles.map((tile) => (
            <motion.span
              key={tile.id}
              className={`status-part status-part--${tile.id}`}
              initial={{ flexGrow: 0 }}
              animate={{ flexGrow: ready ? tile.value / sum : 0 }}
              transition={reduce ? { duration: 0 } : barSpring}
            />
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

export default StatusChart;
