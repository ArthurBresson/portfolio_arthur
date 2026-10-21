import { useEffect, useState } from "react";

// Bulle de verre « retour en haut », visible après 80px de scroll.
function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Revenir en haut de la page"
      className={`scroll-to-top ${isVisible ? "active" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <span className="arrow-up" />
    </button>
  );
}

export default ScrollToTop;
