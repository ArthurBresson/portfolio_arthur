/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import AnimatedIcon from "../ui/AnimatedIcon.jsx";
import Block from "../ui/Block.jsx";

// Case du dashboard : titre, ligne d'aide facultative, puis le graphique qui prend
// toute la hauteur restante. `icon` remplace le point doré du titre par
// une icône Lordicon qui s'anime au survol de la case.
function ChartCard({ title, hint, icon, className = "", children, ...rest }) {
  return (
    <Block className={`chart-card ${className}`.trim()} {...rest}>
      <header className="chart-head">
        <h2 className={`chart-title${icon ? " chart-title--icon" : ""}`}>
          {icon && <AnimatedIcon name={icon} size={20} target=".chart-card" />}
          {title}
        </h2>
        {hint && <p className="chart-hint">{hint}</p>}
      </header>
      <div className="chart-body">{children}</div>
    </Block>
  );
}

export default ChartCard;
