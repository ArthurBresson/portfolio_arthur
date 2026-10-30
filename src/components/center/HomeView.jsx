/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import Tutorial from "../dataviz/Tutorial.jsx";

// Vue d'accueil de la case centrale : mon nom en titre, centré, puis la
// citation en grand.
// Le rôle et la recherche sont dans la frise et sur le CV.
// « Qui je suis » ouvre la présentation et le savoir-être. À la première
// visite, l'astuce s'affiche en dessous.
function HomeView({ profil, tuto, onDismissTuto, onOpenAbout }) {
  const { nom, citation, photo } = profil;
  return (
    <div className="center-view home-view">
      <div className="home-text">
        <h1 className="home-name">{nom}</h1>
        {citation && (
          <figure className="home-quote">
            <blockquote>
              <p>{citation.texte}</p>
            </blockquote>
            <figcaption>{citation.auteur}</figcaption>
          </figure>
        )}
        {onOpenAbout && (
          <button
            type="button"
            className="text-button home-about-link"
            onClick={onOpenAbout}
          >
            Qui je suis <span aria-hidden="true">→</span>
          </button>
        )}
        {tuto && <Tutorial onDismiss={onDismissTuto} />}
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
