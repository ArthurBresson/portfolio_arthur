// Options de chaque axe du filtre, calculées depuis les données.
// Sert aux graphiques (libellés, ordre) et au résumé de la case centrale.
import { anneeOf } from "./filters.js";

// Technos trop vagues pour un filtre utile.
const GENERIC_STACK = new Set(["Data", "Interface", "Web"]);
const TECHNO_LIMIT = 8;

export const AXIS_LABELS = {
  cadre: "Cadre",
  theme: "Thème",
  techno: "Techno",
  annee: "Année",
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

// Technos les plus utilisées, à égalité dans l'ordre d'apparition.
export function technosOf(projets) {
  const counts = new Map();
  for (const projet of projets) {
    for (const tech of projet.stack ?? []) {
      if (!GENERIC_STACK.has(tech))
        counts.set(tech, (counts.get(tech) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .toSorted((a, b) => b[1] - a[1])
    .slice(0, TECHNO_LIMIT)
    .map(([id]) => ({ id, label: id }));
}

export function anneesOf(projets) {
  return [...new Set(projets.map((projet) => anneeOf(projet)))]
    .toSorted()
    .map((id) => ({ id, label: id }));
}

export function buildDimensions(projets, { cadres, themes }) {
  return {
    cadre: cadres,
    theme: themes,
    techno: technosOf(projets),
    annee: anneesOf(projets),
    equipe: EQUIPES,
    statut: STATUTS,
  };
}

export const labelOf = (dimensions, axis, id) =>
  dimensions[axis]?.find((option) => option.id === id)?.label ?? id;
