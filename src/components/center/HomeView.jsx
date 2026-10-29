/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */

// Vue d'accueil de la case centrale : la citation en grand, puis qui je
// suis et ce que je cherche, en deux lignes. Le reste est dans la frise.
function HomeView({ profil }) {
  const { nom, role, recherche, citation, photo } = profil;
  return (
    <div className="center-view home-view">
      <div className="home-text">
        {citation && (
          <figure className="home-quote">
            <blockquote>
              <p>{citation.texte}</p>
            </blockquote>
            <figcaption>{citation.auteur}</figcaption>
          </figure>
        )}
        <div className="home-id">
          <h1 className="home-name">{nom}</h1>
          {role && <p className="home-role">{role}</p>}
          {recherche && <p className="home-search">{recherche}</p>}
        </div>
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
