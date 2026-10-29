/* eslint-disable unicorn/no-null -- convention du projet : null = aucun filtre */
// Filtre croisé partagé par les 8 cases du dashboard. Chaque axe vaut un
// identifiant ou null ; les axes actifs se combinent en ET.

export const AXES = [
  "cadre",
  "theme",
  "competence",
  "techno",
  "equipe",
  "statut",
];

export const NO_FILTER = Object.fromEntries(AXES.map((axis) => [axis, null]));

// Taille d'équipe : pas de `team` = seul.
export function teamKind(projet) {
  if (!projet.team || projet.team < 2) return "solo";
  return projet.team === 2 ? "binome" : "equipe";
}

export const statutOf = (projet) =>
  projet.end === null ? "en-cours" : "livre";

// Une fonction de test par axe : (projet, valeur) -> booléen.
const TESTS = {
  cadre: (projet, value) => projet.cadre === value,
  theme: (projet, value) => projet.themes?.includes(value),
  techno: (projet, value) => projet.stack?.includes(value),
  competence: (projet, value) => projet.competences?.includes(value),
  equipe: (projet, value) => teamKind(projet) === value,
  statut: (projet, value) => statutOf(projet) === value,
};

// Les cartes vides (placeholder) ne comptent jamais.
export const realProjets = (projets) =>
  projets.filter((projet) => !projet.placeholder);

export const isActive = (filtre) => AXES.some((axis) => Boolean(filtre[axis]));

export const activeAxes = (filtre) => AXES.filter((axis) => filtre[axis]);

export function matches(projet, filtre) {
  if (projet.placeholder) return false;
  return AXES.every(
    (axis) => !filtre[axis] || TESTS[axis](projet, filtre[axis]),
  );
}

export const countMatching = (projets, filtre) =>
  projets.filter((projet) => matches(projet, filtre)).length;

// Pour une option d'un axe : `value` = projets qui restent avec les autres
// filtres actifs, `total` = projets de cette option seule (le fantôme).
export function optionCounts(projets, filtre, axis, id) {
  return {
    value: countMatching(projets, { ...filtre, [axis]: id }),
    total: countMatching(projets, { ...NO_FILTER, [axis]: id }),
  };
}

// Vrai si un autre axe que `axis` filtre : le fantôme devient utile.
export const othersActive = (filtre, axis) =>
  AXES.some((other) => other !== axis && filtre[other]);

// Bascule depuis un graphique : si la combinaison ne donne aucun projet,
// on garde seulement ce nouveau choix plutôt qu'un résultat vide.
export function toggleFrom(projets, filtre, axis, id) {
  const next = { ...filtre, [axis]: filtre[axis] === id ? null : id };
  if (next[axis] && countMatching(projets, next) === 0) {
    return { ...NO_FILTER, [axis]: id };
  }
  return next;
}

export const clearAxis = (filtre, axis) => ({ ...filtre, [axis]: null });

export const setAxis = (filtre, axis, id) => ({ ...filtre, [axis]: id });

// Version classique : la grille montre tout (cartes vides comprises) sans
// filtre, sinon uniquement les vrais projets qui correspondent.
export const visibleProjets = (projets, filtre) =>
  isActive(filtre)
    ? projets.filter((projet) => matches(projet, filtre))
    : projets;

// "AAAA-MM" -> index de mois absolu (pour les échelles de temps).
export function monthIndex(value) {
  const [year, month] = value.split("-").map(Number);
  return year * 12 + (month - 1);
}

export function currentMonthIndex(date = new Date()) {
  return date.getFullYear() * 12 + date.getMonth();
}

// Durée lisible : "2 mois", "1 an", "1 an 10 mois".
export function formatDuration(months) {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [];
  if (years > 0) parts.push(`${years} an${years > 1 ? "s" : ""}`);
  if (rest > 0 || years === 0) parts.push(`${rest} mois`);
  return parts.join(" ");
}

// "2 projets", "1 projet", "aucun projet"
export function pluralProjets(count) {
  if (count === 0) return "aucun projet";
  return `${count} projet${count > 1 ? "s" : ""}`;
}
