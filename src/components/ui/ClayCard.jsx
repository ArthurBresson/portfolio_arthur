/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { motion } from "motion/react";
import { springHover, springPress } from "./motionPresets.js";

// Carte en relief, brique de base de toutes les sections.
// - variant : "raised" (relief), "hollow" (creux, pointillé : emplacement vide)
// - interactive : soulèvement à ressort au survol, léger enfoncement à l'appui
// - gold : fin liseré or (réservé à la carte hero)
function ClayCard({
  as = "div",
  variant = "raised",
  interactive = false,
  gold = false,
  className = "",
  children,
  ...rest
}) {
  const Component = motion[as];
  const classes = [
    "clay-card",
    `clay-card--${variant}`,
    interactive && "clay-card--interactive",
    gold && "clay-card--gold",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const motionProperties = interactive
    ? {
        whileHover: { y: -4, transition: springHover },
        whileTap: { y: -1, scale: 0.995, transition: springPress },
      }
    : {};

  return (
    <Component className={classes} {...motionProperties} {...rest}>
      {children}
    </Component>
  );
}

export default ClayCard;
