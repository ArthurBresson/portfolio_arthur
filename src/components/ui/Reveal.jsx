/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { motion } from "motion/react";
import {
  revealVariants,
  revealViewport,
  springReveal,
} from "./motionPresets.js";

// Apparition douce au scroll. `delay` en secondes pour décaler une série.
// Avec prefers-reduced-motion, <MotionConfig reducedMotion="user"> (App)
// supprime la translation et ne garde qu'un fondu.
function Reveal({ as = "div", delay = 0, className, children, ...rest }) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={revealVariants}
      transition={{ ...springReveal, delay }}
      {...rest}
    >
      {children}
    </Component>
  );
}

export default Reveal;
