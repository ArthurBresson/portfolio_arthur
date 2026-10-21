// Effet « lampe torche » des cartes de verre : on expose la position du
// pointeur en variables CSS (--ab-mx / --ab-my), le radial-gradient est
// ensuite entièrement géré en CSS. Souris uniquement (pas de tactile).
export function trackSpotlight(event) {
  if (event.pointerType !== "mouse") return;
  const node = event.currentTarget;
  const bounds = node.getBoundingClientRect();
  node.style.setProperty("--ab-mx", `${event.clientX - bounds.left}px`);
  node.style.setProperty("--ab-my", `${event.clientY - bounds.top}px`);
}
