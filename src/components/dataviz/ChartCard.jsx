/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import ClayCard from "../ui/ClayCard.jsx";

// Case du dashboard : titre, ligne d'aide, puis le graphique qui prend
// toute la hauteur restante.
function ChartCard({ title, hint, className = "", children, ...rest }) {
  return (
    <ClayCard className={`chart-card ${className}`.trim()} {...rest}>
      <header className="chart-head">
        <h2 className="chart-title">{title}</h2>
        {hint && <p className="chart-hint">{hint}</p>}
      </header>
      <div className="chart-body">{children}</div>
    </ClayCard>
  );
}

export default ChartCard;
