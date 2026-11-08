/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { useState } from "react";

// Savoir-être : une phrase par qualité, puis les expériences qui la
// prouvent. Sur mobile (`anchor`), ce sont des liens vers la section
// Parcours. Sur le dashboard, le parcours détaillé n'est pas affiché :
// chaque expérience se déplie sur place.
function QualityList({
  savoirEtre = [],
  parcours = [],
  anchor = false,
  compact = false,
  Heading = "h3",
}) {
  const [open, setOpen] = useState();
  const byId = new Map(parcours.map((etape) => [etape.id, etape]));

  return (
    <ul className={`quality-list${compact ? " quality-list--compact" : ""}`}>
      {savoirEtre.map((qualite) => {
        const etapes = (qualite.experiences ?? [])
          .map((id) => byId.get(id))
          .filter(Boolean);
        const shown = etapes.find(
          (etape) => `${qualite.id}:${etape.id}` === open,
        );
        return (
          <li key={qualite.id} className="quality">
            <Heading className="quality-title">{qualite.titre}</Heading>
            <p className="quality-proof">{qualite.phrase}</p>
            {etapes.length > 0 && (
              <p className="quality-refs">
                <span className="quality-refs-label">Voir :</span>
                {etapes.map((etape) => {
                  const key = `${qualite.id}:${etape.id}`;
                  return anchor ? (
                    <a
                      key={etape.id}
                      className="quality-ref"
                      href={`#parcours-${etape.id}`}
                    >
                      {etape.place}
                    </a>
                  ) : (
                    <button
                      key={etape.id}
                      type="button"
                      className="quality-ref"
                      aria-expanded={open === key}
                      onClick={() =>
                        setOpen((current) =>
                          current === key ? undefined : key,
                        )
                      }
                    >
                      {etape.place}
                    </button>
                  );
                })}
              </p>
            )}
            {shown && (
              <p className="quality-ref-detail">
                <strong>{shown.title}</strong> · {shown.detail}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default QualityList;
