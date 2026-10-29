/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import Badge from "../ui/Badge.jsx";
import BackButton from "./BackButton.jsx";

// Vue sport de la case centrale : courses, chronos et ce que ça m'apporte.
function SportView({ lifestyle, onBack }) {
  const triathlon = lifestyle.find((item) => item.id === "triathlon");
  const cap = lifestyle.find((item) => item.id === "cap");

  return (
    <div className="center-view detail-view">
      <BackButton onBack={onBack} />
      <div className="detail-grid">
        {triathlon && (
          <section className="detail-block">
            <h2 className="detail-title">Triathlon</h2>
            <ul className="race-list">
              {triathlon.courses.map((race) => (
                <li key={race.lieu} className="race">
                  <span className="race-place">{race.lieu}</span>
                  <span className="race-format">{race.format}</span>
                  <Badge className="race-time tabular">{race.temps}</Badge>
                </li>
              ))}
            </ul>
            <p className="detail-note">
              {/* Les formats se lisent déjà dans la liste des courses. */}
              {triathlon.stats
                .filter((stat) => stat.label !== "Formats")
                .map((stat) => `${stat.label} : ${stat.value}`)
                .join(" · ")}
            </p>
            <p className="detail-apport">{triathlon.apport}</p>
          </section>
        )}
        {cap && (
          <section className="detail-block">
            <h2 className="detail-title">Course à pied</h2>
            <dl className="chrono-list">
              {cap.stats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd className="text-gold tabular">{stat.value}</dd>
                </div>
              ))}
            </dl>
            <p className="detail-apport">{cap.apport}</p>
          </section>
        )}
      </div>
    </div>
  );
}

export default SportView;
