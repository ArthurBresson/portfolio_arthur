/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */

// Retour à la vue précédente de la case centrale.
function BackButton({ onBack }) {
  return (
    <button type="button" className="text-button back-button" onClick={onBack}>
      <span aria-hidden="true">←</span> Retour
    </button>
  );
}

export default BackButton;
