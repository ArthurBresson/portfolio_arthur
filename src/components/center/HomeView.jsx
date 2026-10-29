/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */

// Mots entre astérisques dans `profil.accroche` => dégradé or.
function renderHighlight(text) {
  return text.split(/\*([^*]+)\*/).map((part, index) =>
    index % 2 === 1 ? (
      <em key={index} className="text-gold">
        {part}
      </em>
    ) : (
      part
    ),
  );
}

// Vue d'accueil de la case centrale : nom, rôle, titre, citation, photo.
function HomeView({ profil, total }) {
  const { nom, role, accroche, citation, photo } = profil;
  return (
    <div className="center-view home-view">
      <div className="home-text">
        <p className="home-name">{nom}</p>
        <h1 className="home-title">
          {accroche ? renderHighlight(accroche) : nom}
        </h1>
        {role && <p className="home-role">{role}</p>}
        {citation && (
          <figure className="home-quote">
            <blockquote>
              <p>« {citation.texte} »</p>
            </blockquote>
            <figcaption>{citation.auteur}</figcaption>
          </figure>
        )}
        <p className="home-hint">
          {total} projets autour de moi. Clique un graphique pour les voir.
        </p>
      </div>
      {photo && (
        <figure className="home-photo">
          <img
            src={photo}
            alt={`Portrait de ${nom}`}
            width="512"
            height="512"
            fetchPriority="high"
          />
        </figure>
      )}
    </div>
  );
}

export default HomeView;
