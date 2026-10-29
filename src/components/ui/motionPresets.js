// Ressorts et variantes partagés par tous les composants animés (motion).
// Les courbes CSS équivalentes sont dans tokens.css (--ease-*).

// Survol : réponse vive, léger dépassement.
export const springHover = {
  type: "spring",
  stiffness: 420,
  damping: 26,
  mass: 0.7,
};

// Appui : très raide, aucun rebond perceptible.
export const springPress = {
  type: "spring",
  stiffness: 700,
  damping: 34,
  mass: 0.6,
};

// Apparition au scroll : douce, sans rebond.
export const springReveal = {
  type: "spring",
  stiffness: 140,
  damping: 22,
  mass: 0.9,
};

// Le contenu reste lisible au repos : on part d'une opacité partielle,
// jamais de 0, pour qu'une capture ou un scroll rapide ne montre pas de vide.
export const revealVariants = {
  hidden: { opacity: 0.35, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export const revealViewport = {
  once: true,
  amount: 0.15,
  margin: "0px 0px -8% 0px",
};

// Barres et colonnes des graphiques : croissance souple.
export const barSpring = {
  type: "spring",
  stiffness: 190,
  damping: 26,
  mass: 0.8,
};
