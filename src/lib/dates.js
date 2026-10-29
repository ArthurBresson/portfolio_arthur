// Mise en forme des dates "AAAA-MM" du fichier de données.
const MONTHS = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

// "2024-12" -> "déc. 2024"
export function formatMonth(value) {
  if (!value) return "";
  const [year, month] = value.split("-").map(Number);
  if (!month) return String(year);
  return `${MONTHS[month - 1]} ${year}`;
}

// Période lisible : "déc. 2024", "sept. 2023 – juin 2025", "depuis oct. 2025".
export function formatPeriod(start, end) {
  if (!start) return "";
  if (end === null) return `depuis ${formatMonth(start)}`;
  if (!end || end === start) return formatMonth(start);
  const [startYear] = start.split("-");
  const [endYear] = end.split("-");
  // Même année : on n'écrit l'année qu'une fois.
  if (startYear === endYear) {
    return `${formatMonth(start).split(" ")[0]} – ${formatMonth(end)}`;
  }
  return `${formatMonth(start)} – ${formatMonth(end)}`;
}

// Tri du plus récent au plus ancien (comparaison lexicale sûre sur AAAA-MM).
export const byStartDesc = (a, b) =>
  (b.start ?? "").localeCompare(a.start ?? "");
