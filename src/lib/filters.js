/* eslint-disable unicorn/no-null -- convention du projet : null = aucun filtre */
// Filtre croisé cadre × thème, partagé par les graphiques et les chips.
// État : { cadre: string|null, theme: string|null }.

export const NO_FILTER = { cadre: null, theme: null };

// Les cartes vides (placeholder) ne comptent jamais dans les graphiques.
export const realProjets = (projets) =>
  projets.filter((projet) => !projet.placeholder);

export const isActive = (filtre) => Boolean(filtre.cadre || filtre.theme);

export function matches(projet, { cadre, theme }) {
  if (projet.placeholder) return false;
  if (cadre && projet.cadre !== cadre) return false;
  if (theme && !projet.themes?.includes(theme)) return false;
  return true;
}

// Liste affichée dans la grille : tout (cartes vides comprises) sans
// filtre, sinon uniquement les vrais projets qui correspondent.
export const visibleProjets = (projets, filtre) =>
  isActive(filtre)
    ? projets.filter((projet) => matches(projet, filtre))
    : projets;

export const countMatching = (projets, filtre) =>
  projets.filter((projet) => matches(projet, filtre)).length;

// Bascule depuis un graphique : si la combinaison ne donne aucun projet,
// on lâche l'autre axe plutôt que d'afficher une grille vide.
export function toggleFrom(projets, filtre, axis, id) {
  const next = { ...filtre, [axis]: filtre[axis] === id ? null : id };
  if (next[axis] && countMatching(projets, next) === 0) {
    return { ...NO_FILTER, [axis]: id };
  }
  return next;
}

export const setAxis = (filtre, axis, id) => ({ ...filtre, [axis]: id });

export const clearAxis = (filtre, axis) => ({ ...filtre, [axis]: null });

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
