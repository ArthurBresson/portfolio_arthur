import { useEffect, useRef, useState } from "react";

// Déclenche `true` une seule fois quand l'élément entre dans le viewport,
// pour les animations d'apparition au scroll (voir <Reveal />).
export function useInView({
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
} = {}) {
  const reference = useRef(null);
  const [isInView, setIsInView] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const node = reference.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [reference, isInView];
}
