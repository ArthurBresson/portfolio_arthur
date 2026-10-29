/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { motion } from "motion/react";
import { springHover, springPress } from "./motionPresets.js";

// Bouton clay. Rend un <a> si `href` est fourni, sinon un <button>.
// - variant : "primary" (accent rouge) ou "soft" (surface en relief)
// - size : "md" ou "sm"
// - icon : élément placé avant le libellé
function Button({
  href,
  variant = "primary",
  size = "md",
  icon,
  external = false,
  className = "",
  children,
  ...rest
}) {
  const classes = ["btn", `btn--${variant}`, `btn--${size}`, className]
    .filter(Boolean)
    .join(" ");

  const motionProperties = {
    whileHover: { y: -1, transition: springHover },
    whileTap: { y: 1, scale: 0.98, transition: springPress },
  };

  const content = (
    <>
      {icon && <span className="btn-icon">{icon}</span>}
      {children && <span className="btn-label">{children}</span>}
    </>
  );

  if (href) {
    const externalProperties = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
    return (
      <motion.a
        href={href}
        className={classes}
        {...externalProperties}
        {...motionProperties}
        {...rest}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      className={classes}
      {...motionProperties}
      {...rest}
    >
      {content}
    </motion.button>
  );
}

export default Button;
