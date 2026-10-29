// Options de chaque axe du filtre, calculées depuis les données.
// Sert aux graphiques (libellés, ordre) et au résumé de la case centrale.

// Technos trop vagues pour un filtre utile.
const GENERIC_STACK = new Set(["Data", "Interface", "Web"]);
const TECHNO_LIMIT = 8;

export const AXIS_LABELS = {
  cadre: "Cadre",
  theme: "Thème",
  competence: "Compétence",
  techno: "Techno",
  equipe: "Équipe",
  statut: "Statut",
};

export const EQUIPES = [
  { id: "solo", label: "Seul" },
  { id: "binome", label: "Binôme" },
  { id: "equipe", label: "Équipe" },
];

export const STATUTS = [
  { id: "livre", label: "Livrés" },
  { id: "en-cours", label: "En cours" },
];

// Technos les plus utilisées. À égalité, la plus récemment utilisée
// passe devant : le graphique montre ce que je pratique aujourd'hui.
export function technosOf(projets) {
  const counts = new Map();
  const lastUse = new Map();
  for (const projet of projets) {
    for (const tech of projet.stack ?? []) {
      if (GENERIC_STACK.has(tech)) continue;
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
      if ((lastUse.get(tech) ?? "") < projet.start)
        lastUse.set(tech, projet.start);
    }
  }
  return [...counts.entries()]
    .toSorted(
      (a, b) =>
        b[1] - a[1] || lastUse.get(b[0]).localeCompare(lastUse.get(a[0])),
    )
    .slice(0, TECHNO_LIMIT)
    .map(([id]) => ({ id, label: id }));
}

export function buildDimensions(projets, { cadres, themes, competences }) {
  return {
    cadre: cadres,
    theme: themes,
    competence: competences,
    techno: technosOf(projets),
    equipe: EQUIPES,
    statut: STATUTS,
  };
}

export const labelOf = (dimensions, axis, id) =>
  dimensions[axis]?.find((option) => option.id === id)?.label ?? id;
