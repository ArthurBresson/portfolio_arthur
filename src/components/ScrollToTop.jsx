import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpIcon } from "./ui/Icons.jsx";
import { springHover, springPress } from "./ui/motionPresets.js";

// Bouton « retour en haut », visible après un écran de scroll (masqué sur
// téléphone, voir layout.css).
function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          aria-label="Revenir en haut de la page"
          className="scroll-to-top"
          onClick={() => window.scrollTo({ top: 0 })}
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          whileHover={{ y: -2, transition: springHover }}
          whileTap={{ scale: 0.92, transition: springPress }}
          transition={springHover}
        >
          <ArrowUpIcon />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default ScrollToTop;
