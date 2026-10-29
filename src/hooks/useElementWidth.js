import { useEffect, useState } from "react";

// Largeur d'un élément, suivie avec ResizeObserver. Sert aux graphiques
// SVG pour dessiner en pixels réels (textes jamais déformés).
export function useElementWidth(reference, fallback = 520) {
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const element = reference.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.round(entry.contentRect.width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [reference]);

  return width;
}

// Hauteur d'un élément, même principe : un graphique qui remplit une case
// du dashboard s'adapte à la place disponible.
export function useElementHeight(reference, fallback = 0) {
  const [height, setHeight] = useState(fallback);

  useEffect(() => {
    const element = reference.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      setHeight(Math.round(entry.contentRect.height));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [reference]);

  return height;
}
