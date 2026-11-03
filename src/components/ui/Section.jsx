/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import AnimatedIcon from "./AnimatedIcon.jsx";
import Reveal from "./Reveal.jsx";

// Enveloppe commune des sections : ancre, en-tête (kicker + titre + intro).
// `icon` : icône Lordicon devant le kicker, jouée une fois à l'arrivée.
// `number` : numéro de section (« 02 »), repris du menu.
function Section({
  id,
  kicker,
  icon,
  number,
  title,
  lead,
  className = "",
  children,
}) {
  const titleId = `${id}-title`;
  return (
    <section
      id={id}
      className={`section ${className}`.trim()}
      aria-labelledby={titleId}
    >
      <div className="container">
        <Reveal as="header" className="section-head">
          {kicker && (
            <p className="section-kicker">
              {number && <span className="section-number">{number}</span>}
              {icon && <AnimatedIcon name={icon} size={20} trigger="in" />}
              {kicker}
            </p>
          )}
          <h2 id={titleId} className="section-title">
            {title}
          </h2>
          {lead && <p className="section-lead">{lead}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

export default Section;
