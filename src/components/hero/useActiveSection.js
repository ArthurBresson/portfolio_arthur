import { useEffect, useState } from "react";

// Renvoie l'id de la section actuellement lue (ou undefined avant la première).
// Une section est « active » quand elle croise une ligne de lecture située
// vers 40-45 % de la hauteur de l'écran (IntersectionObserver). Entre deux
// sections on garde la précédente ; en bas de page, la dernière l'emporte
// (une section courte n'atteindrait jamais la ligne de lecture).
export function useActiveSection(
  ids,
  { rootMargin = "-40% 0px -55% 0px" } = {},
) {
  const [activeId, setActiveId] = useState();
  const key = ids.join(" ");

  useEffect(() => {
    const list = key.split(" ").filter(Boolean);
    const elements = list
      .map((id) => document.querySelector(`#${CSS.escape(id)}`))
      .filter(Boolean);
    if (elements.length === 0) return;

    const visible = new Set();
    let frame = 0;

    const resolve = () => {
      frame = 0;
      const root = document.documentElement;
      const atBottom =
        globalThis.scrollY > 0 &&
        globalThis.innerHeight + globalThis.scrollY >= root.scrollHeight - 2;
      if (atBottom) {
        setActiveId(elements.at(-1).id);
        return;
      }
      const current = list.find((id) => visible.has(id));
      if (current) {
        setActiveId(current);
        return;
      }
      if (
        elements[0].getBoundingClientRect().top >
        globalThis.innerHeight * 0.45
      ) {
        setActiveId(undefined);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(resolve);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        schedule();
      },
      { rootMargin },
    );
    for (const element of elements) observer.observe(element);
    globalThis.addEventListener("scroll", schedule, { passive: true });

    return () => {
      observer.disconnect();
      globalThis.removeEventListener("scroll", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key, rootMargin]);

  return activeId;
}

export default useActiveSection;
