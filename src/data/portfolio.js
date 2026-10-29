// Source unique du portfolio. Les graphiques, les filtres et les cartes
// sont tous calculés à partir de ces tableaux : ajouter un projet ici suffit
// pour qu'il apparaisse partout.
//
// Dates au format "AAAA-MM". `end: null` = en cours. Un projet dure au
// moins 3 mois : un mois avant et un mois après le mois de référence.
// Les textes sont rédigés et validés pour la mise en ligne. Règle pour toute
// modification : première personne, phrases courtes, une preuve (chiffre,
// résultat, chose livrée) plutôt qu'un adjectif. Ne rien affirmer qui ne soit
// pas vérifiable.
const GITHUB = "https://github.com/ArthurBresson";

export const profil = {
  nom: "Arthur Bresson",
  role: "BUT Informatique, 3e année — data analyst en alternance chez Hager",
  // Ce que je cherche après le BUT (affiché sous le rôle).
  recherche:
    "Je cherche une alternance en Master ou en école d'ingénieur, en IA / ML engineering.",
  localisation: "Saint-Léonard (51)",
  email: "arthur.bresson17@gmail.com",
  photo: "/arthur-photo.webp",
  // Variantes d'accroche (12 mots max) :
  //   1. "Développeur data et web. Je livre vite et je mesure tout."
  //   2. "Contrôle aérien, agence web, réseaux de neurones. En trois ans d'études."
  //   3. "Je code comme je m'entraîne, avec un chrono et un plan."
  // Retenue par Arthur. Les mots entre astérisques s'affichent en dégradé or.
  accroche: "Alternant la journée, *triathlète et auto-entrepreneur* le soir.",
  // Arthur hésitait avec Bill Gates : « C'est bien de célébrer le succès,
  // mais il est plus important de tenir compte des leçons de l'échec. »
  citation: {
    texte:
      "Notre plus grande faiblesse, c'est d'abandonner. Le plus sûr moyen de réussir, c'est toujours d'essayer juste encore une fois.",
    auteur: "Thomas Edison",
  },
  preuves: [
    { value: "13", label: "projets menés en trois ans, de l'école au client" },
    { value: "18 j", label: "pour livrer un site vitrine BressoDup" },
    { value: "33'37", label: "au 10 km, le chrono dont je suis le plus fier" },
  ],
  socials: [
    { label: "GitHub", url: GITHUB },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/arthur-bresson-1476772b5/",
    },
  ],
};

// Cadre dans lequel un projet a été réalisé. Sert d'axe 1 du filtre croisé.
// « Pro » = stage et alternance (un employeur) ; « Entreprise » = mon
// agence BressoDup, où je suis cofondateur.
export const cadres = [
  { id: "utt", label: "UTT" },
  { id: "iut", label: "IUT" },
  { id: "pro", label: "Stage & alternance" },
  { id: "entreprise", label: "Entreprise" },
  { id: "perso", label: "Perso" },
];

// Les 6 compétences du référentiel national du BUT Informatique. En 3e
// année du parcours « Administration, gestion et exploitation des
// données », trois sont au cœur du parcours (`parcours: true`).
export const competences = [
  { id: "realiser", label: "Réaliser", detail: "Développer une application" },
  {
    id: "optimiser",
    label: "Optimiser",
    detail: "Rendre une application ou un algorithme plus efficace",
  },
  {
    id: "administrer",
    label: "Administrer",
    detail: "Installer et configurer des systèmes et des réseaux",
  },
  {
    id: "gerer",
    label: "Gérer les données",
    detail: "Concevoir, administrer et exploiter des bases de données",
    parcours: true,
  },
  {
    id: "conduire",
    label: "Conduire un projet",
    detail: "Organiser, planifier et livrer",
    parcours: true,
  },
  {
    id: "collaborer",
    label: "Collaborer",
    detail: "Travailler dans une équipe informatique",
    parcours: true,
  },
];

// Axe 2 du filtre croisé. Un projet peut avoir plusieurs thèmes.
export const themes = [
  { id: "web", label: "Web" },
  { id: "data", label: "Data" },
  { id: "ia", label: "IA / ML" },
  { id: "bdd", label: "BDD" },
  { id: "agents", label: "AI Engineering" },
  { id: "jeu", label: "Jeu / Algo" },
];

// Graphique 1 : frise du temps. `cadre` relie une période aux projets.
export const parcours = [
  {
    id: "bac",
    type: "formation",
    title: "Bac général, mention Bien",
    place: "Lycée Marc Chagall",
    start: "2020-09",
    end: "2023-07",
    detail:
      "Spécialités Maths, Physique-Chimie et Maths expertes. Section euro anglais.",
  },
  {
    id: "utt",
    type: "formation",
    cadre: "utt",
    title: "Prépa intégrée ingénieur",
    place: "UTT",
    start: "2023-09",
    end: "2025-06",
    detail:
      "Deux ans de bases scientifiques. Ils m'ont ouvert l'entrée directe en 2e année de BUT.",
  },
  {
    id: "iut",
    type: "formation",
    cadre: "iut",
    title: "BUT Informatique — parcours bases de données",
    place: "IUT Reims-Châlons-Charleville",
    start: "2025-09",
    end: "2027-08",
    detail:
      "Parcours bases de données. Entré directement en 2e année, 3e année en alternance chez Hager.",
  },
  {
    id: "spie",
    type: "experience",
    title: "Stage technicien de maintenance",
    place: "SPIE Facilities",
    start: "2024-07",
    end: "2024-08",
    detail:
      "Diagnostic et réparation d'équipements mécaniques, maintenance préventive et curative.",
  },
  {
    id: "conseil-utt",
    type: "experience",
    title: "Responsable communication",
    place: "Conseil UTT",
    start: "2024-09",
    end: "2025-06",
    detail:
      "J'ai organisé le concours d'éloquence 2025 et dirigé le pôle communication.",
  },
  {
    id: "evad",
    type: "experience",
    title: "Animateur en colonie",
    place: "Evad'Assoc",
    start: "2025-07",
    end: "2025-08",
    detail: "Deux colonies animées, la première seul, la seconde en équipe.",
  },
  {
    id: "crna",
    type: "experience",
    cadre: "pro",
    title: "Stage développeur",
    place: "CRNA Est",
    start: "2026-04",
    end: "2026-07",
    detail:
      "Quatre mois au centre de contrôle aérien Est, sur une interface de données de vols.",
  },
  {
    id: "hager",
    type: "experience",
    cadre: "pro",
    title: "Alternance data analyst",
    place: "Hager, Obernai",
    start: "2026-09",
    end: "2027-08",
    detail:
      "Data analyst en alternance : tableaux de bord Power BI et qualité des données.",
  },
];

// Graphique 2 + grille filtrable. `placeholder: true` = carte vide, ignorée
// par les graphiques et les filtres.
export const projets = [
  {
    id: "reco-films",
    title: "Recommandation de films",
    pitch:
      "Un moteur de recommandation de films écrit en C, piloté par une interface Python.",
    start: "2024-11",
    end: "2025-01",
    cadre: "utt",
    competences: ["realiser", "optimiser"],
    themes: ["ia", "data"],
    stack: ["Python", "C"],
    links: [{ label: "GitHub", url: `${GITHUB}/Recommendation_film` }],
  },
  {
    id: "soutenances",
    title: "Gestion des soutenances",
    pitch:
      "Le planning des soutenances de fin d'année, pour étudiants et enseignants. Un créneau n'est validé que si le binôme d'enseignants est complet, et c'est l'application qui le vérifie.",
    start: "2025-05",
    end: "2025-07",
    cadre: "utt",
    competences: ["realiser", "gerer", "collaborer"],
    themes: ["web", "bdd"],
    stack: ["PHP", "SQL"],
    team: 2,
    links: [
      { label: "GitHub", url: `${GITHUB}/Projet_organisation_soutenances` },
    ],
  },
  {
    id: "knn",
    title: "kNN — Titanic & Iris",
    pitch:
      "Les k plus proches voisins codés à la main et testés sur Titanic et Iris. Je prépare les données, je choisis k et j'évalue le résultat.",
    start: "2025-05",
    end: "2025-07",
    cadre: "perso",
    competences: ["optimiser"],
    themes: ["ia", "data"],
    stack: ["Python"],
  },
  {
    id: "saint-leonard",
    title: "Site de Saint-Léonard",
    pitch:
      "Le site d'information de ma commune. Je le maintiens bénévolement depuis octobre 2025.",
    start: "2025-10",
    end: null,
    cadre: "perso",
    competences: ["realiser"],
    themes: ["web"],
    stack: ["Web"],
    links: [
      { label: "saintleonard-marne.fr", url: "https://saintleonard-marne.fr/" },
    ],
  },
  {
    id: "colive",
    title: "CoLive",
    pitch:
      "Une plateforme de logements pour alternants, construite à cinq en Symfony. Recherche de biens, back-office d'administration, données générées par fixtures et un chatbot.",
    start: "2025-11",
    end: "2026-01",
    cadre: "iut",
    competences: ["realiser", "gerer", "collaborer"],
    themes: ["web", "bdd"],
    stack: ["Symfony", "PHP", "Twig", "SQL"],
    team: 5,
    links: [{ label: "GitHub", url: `${GITHUB}/colive` }],
  },
  {
    id: "emprunt",
    title: "Tableau d'emprunt",
    pitch:
      "Un simulateur de prêt en JavaScript, sans framework. Annuités ou amortissements constants, toutes les périodicités, et le coût total du crédit.",
    start: "2025-12",
    end: "2026-02",
    cadre: "iut",
    competences: ["realiser"],
    themes: ["web"],
    stack: ["JavaScript", "HTML", "CSS"],
    links: [{ label: "GitHub", url: `${GITHUB}/prog_tableau_emprunt` }],
  },
  {
    id: "gamejam",
    title: "GameJam",
    pitch: "Un jeu Python codé à deux, dans le temps imposé d'une game jam.",
    start: "2025-12",
    end: "2026-02",
    cadre: "iut",
    competences: ["realiser", "collaborer"],
    themes: ["jeu"],
    stack: ["Python"],
    team: 2,
    links: [{ label: "GitHub", url: `${GITHUB}/GameJam` }],
  },
  {
    id: "running-data",
    title: "Running Data",
    pitch:
      "La météo change-t-elle nos chronos ? À quatre, on a croisé des fichiers Garmin seconde par seconde avec Open-Meteo, stocké le tout en PostgreSQL et analysé les résultats dans Streamlit.",
    start: "2026-02",
    end: "2026-04",
    cadre: "iut",
    competences: ["gerer", "collaborer"],
    themes: ["data", "bdd"],
    stack: ["Python", "PostgreSQL", "Streamlit"],
    team: 4,
    links: [
      { label: "GitHub", url: `${GITHUB}/Running-data-streamlit` },
      { label: "Slides", url: "https://presentation-sae.vercel.app/" },
    ],
  },
  {
    id: "crna-vols",
    title: "Interface données de vols",
    pitch:
      "Mon stage au centre de contrôle aérien Est. J'y ai développé une interface pour exploiter les données de vols.",
    start: "2026-04",
    end: "2026-07",
    cadre: "pro",
    competences: ["realiser", "gerer"],
    themes: ["data", "web"],
    stack: ["Data", "Interface"],
  },
  {
    id: "hager-data",
    title: "Data analyst chez Hager",
    pitch:
      "Mon alternance de 3e année. Je construis des tableaux de bord Power BI et je surveille la qualité des données.",
    start: "2026-09",
    end: null,
    cadre: "pro",
    competences: ["gerer"],
    themes: ["data"],
    stack: ["Power BI"],
  },
  {
    id: "bressodup",
    title: "BressoDup",
    pitch:
      "L'agence web que j'ai cofondée avec Nathan. Des sites vitrines pour PME et artisans de la Marne et des Ardennes, livrés en 18 jours, avec un score Lighthouse de 90+ écrit dans le contrat.",
    start: "2026-09",
    end: null,
    cadre: "entreprise",
    competences: ["conduire", "realiser", "collaborer"],
    themes: ["web"],
    stack: ["React", "TypeScript"],
    team: 2,
    links: [{ label: "bressodup.fr", url: "https://bressodup.fr" }],
  },
  {
    id: "zero-to-hero",
    title: "Neural Networks: Zero to Hero",
    pitch:
      "Le cours d'Andrej Karpathy, notebook par notebook. J'ai recodé micrograd et toute la série makemore, jusqu'à la rétropropagation écrite à la main. Prochaine étape : les Transformers.",
    start: "2026-09",
    end: null,
    cadre: "perso",
    competences: ["optimiser"],
    themes: ["ia"],
    stack: ["Python", "PyTorch"],
    links: [{ label: "GitHub", url: `${GITHUB}/my_neural_network_learning` }],
  },
  {
    id: "portfolio",
    title: "Ce portfolio",
    pitch:
      "Construit en pilotant des agents spécialisés pour le design, la data-viz et la rédaction. L'architecture et la relecture finale, je les garde.",
    start: "2026-10",
    end: null,
    cadre: "perso",
    competences: ["realiser", "conduire"],
    themes: ["agents", "web"],
    stack: ["React", "Claude Code"],
    links: [{ label: "GitHub", url: `${GITHUB}/portfolio_arthur` }],
  },
  // Projets du GitLab IUT, en cours de fork vers un dépôt public. Affichés en
  // cartes vides dans la grille, exclus des graphiques et des filtres.
  { id: "iut-a-venir-1", placeholder: true, cadre: "iut", themes: [] },
  { id: "iut-a-venir-2", placeholder: true, cadre: "iut", themes: [] },
];

// Section lifestyle (bento). `apport` = ce que ça change au quotidien.
export const lifestyle = [
  {
    id: "triathlon",
    title: "Triathlon",
    stats: [
      { label: "Formats", value: "S · M" },
      { label: "Prochain", value: "Half, juin 2027" },
    ],
    // Épernay avant Madine : 15 min gagnées sur le M.
    courses: [
      { lieu: "Épernay", format: "M", temps: "2h43" },
      { lieu: "Madine", format: "M", temps: "2h28" },
      { lieu: "Châlons", format: "S", temps: "1h04" },
    ],
    apport:
      "Nager, rouler, courir, en plus des cours et de l'alternance. Je planifie chaque créneau de la semaine, et j'ai gagné 15 minutes entre mes deux triathlons M.",
  },
  {
    id: "cap",
    title: "Course à pied",
    stats: [
      { label: "10 km", value: "33'37" },
      { label: "Semi", value: "1h17'58" },
      { label: "800 m", value: "1'57" },
    ],
    apport:
      "Le chrono ne ment pas. Quand une séance rate, je cherche pourquoi et j'ajuste la suivante.",
  },
  {
    id: "echecs",
    title: "Échecs",
    apport:
      "À 1012 Elo, j'ai encore du chemin. On perd une bataille, pas la guerre : chaque défaite me sert à mieux jouer la suivante.",
  },
];

export const hobbies = ["7 Wonders", "Skull King", "Voyage"];

export const langues = [
  { name: "Anglais", level: "C1+ (Linguaskill)" },
  { name: "Espagnol", level: "B2 (SIELE)" },
];
