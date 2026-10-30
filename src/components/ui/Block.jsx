/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { motion } from "motion/react";

// Bloc de contenu sans boîte, brique de base de toutes les sections : pas
// de fond ni d'ombre, la mise en page le sépare par l'espace et des filets.
// - variant : "plain" (défaut) ou "hollow" (pointillé : emplacement vide)
// - interactive : le titre réagit au survol (CSS), le bloc ne bouge pas
// - gold : filet or en tête (réservé à l'accueil)
function Block({
  as = "div",
  variant = "plain",
  interactive = false,
  gold = false,
  className = "",
  children,
  ...rest
}) {
  const Component = motion[as];
  const classes = [
    "block",
    `block--${variant}`,
    interactive && "block--interactive",
    gold && "block--gold",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
}

export default Block;
