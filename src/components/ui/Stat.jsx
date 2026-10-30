/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import Badge from "./Badge.jsx";

// Chiffre clé : valeur en display tabulaire + libellé, badge de signature optionnel.
// À placer dans un <dl className="stat-list"> (dt/dd). La valeur est affichée
// au-dessus du libellé via CSS (order), l'ordre DOM reste dt puis dd.
// `gold` passe la valeur elle-même en couleur de signature (perf, record).
function Stat({
  value,
  label,
  badge,
  gold = false,
  size = "md",
  className = "",
}) {
  if (value === undefined || value === null || value === "") return;
  return (
    <div className={`stat stat--${size} ${className}`.trim()}>
      <dt className="stat-label">{label}</dt>
      <dd className={`stat-value tabular ${gold ? "text-gold" : ""}`.trim()}>
        {value}
        {badge && <Badge className="stat-badge">{badge}</Badge>}
      </dd>
    </div>
  );
}

export default Stat;
