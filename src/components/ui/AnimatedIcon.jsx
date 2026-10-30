/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { Suspense, lazy, useEffect, useState } from "react";

// Icône animée Lordicon (https://lordicon.com), hébergée avec le site :
// les animations sont dans src/assets/lordicon et le lecteur n'est chargé
// qu'à la première icône affichée (la CSP n'autorise aucun script tiers).
// - name : nom du fichier JSON (book, check, cup…)
// - trigger : « hover » par défaut, une seule lecture ; « in » joue une
//   fois quand l'icône entre à l'écran
// - target : sélecteur de l'ancêtre qui déclenche (le lien, la ligne…)
// L'icône prend la couleur du texte. Si le visiteur demande moins
// d'animations, elle reste figée.
const LordIcon = lazy(() =>
  import("@lordicon/react").then((module) => ({ default: module.LordIcon })),
);
const sources = import.meta.glob("../../assets/lordicon/*.json", {
  import: "default",
});

function AnimatedIcon({
  name,
  size = 24,
  trigger = "hover",
  target,
  className = "",
}) {
  const [icon, setIcon] = useState();

  useEffect(() => {
    let alive = true;
    sources[`../../assets/lordicon/${name}.json`]?.().then((data) => {
      if (alive) setIcon(data);
    });
    return () => {
      alive = false;
    };
  }, [name]);

  return (
    <span
      className={`anim-icon ${className}`.trim()}
      style={{ "--icon-size": `${size}px` }}
      aria-hidden="true"
    >
      {icon && (
        <Suspense fallback={undefined}>
          <LordIcon
            icon={icon}
            trigger={trigger}
            target={target}
            currentColor
          />
        </Suspense>
      )}
    </span>
  );
}

export default AnimatedIcon;
