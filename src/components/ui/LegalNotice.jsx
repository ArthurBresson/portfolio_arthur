/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */

// Mentions légales repliées : un lien discret qui s'ouvre sur place.
function LegalNotice({ mentions, email, className = "" }) {
  if (!mentions) return;
  return (
    <details className={`legal ${className}`.trim()}>
      <summary>Mentions légales</summary>
      <dl className="legal-list">
        <div>
          <dt>Éditeur</dt>
          <dd>
            {mentions.editeur}
            {email && (
              <>
                {" "}
                · <a href={`mailto:${email}`}>{email}</a>
              </>
            )}
          </dd>
        </div>
        <div>
          <dt>Hébergeur</dt>
          <dd>{mentions.hebergeur}</dd>
        </div>
        <div>
          <dt>Données</dt>
          <dd>{mentions.donnees}</dd>
        </div>
      </dl>
    </details>
  );
}

export default LegalNotice;
