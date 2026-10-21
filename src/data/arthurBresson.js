// Toutes les informations affichées sur la page /arthurbresson.
// Pour mettre le profil à jour, il suffit d'éditer les valeurs ci-dessous —
// aucune modification de composant n'est nécessaire.
//
// Chaque entrée de `sections` est à la fois :
//   - un neurone d'entrée du réseau de la hero,
//   - une bulle de la navbar une fois la page scrollée,
//   - une section de contenu (ancre `#${id}`).
const GITHUB = "https://github.com/ArthurBresson";

const arthurBresson = {
  nom: "Arthur Bresson",
  titrePro: "Étudiant en 3e année de BUT Informatique — alternant chez Hager",
  tagline:
    "J'entraîne des modèles, je structure des bases de données et je m'entraîne pour le triathlon. Toujours avec la même méthode : analyser, itérer, progresser.",
  localisation: "Saint-Léonard (51), France",
  email: "arthur.bresson17@gmail.com",
  // Chemin vers la photo du nœud central (dans /public). null = placeholder « AB ».
  photo: "/arthur-photo.webp",

  socials: [
    { label: "GitHub", url: GITHUB },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/arthur-bresson-1476772b5/",
    },
  ],

  sections: [
    {
      id: "data",
      label: "Data",
      accent: "#38bdf8",
      title: "Faire parler les données",
      pitch:
        "Un flux de données brut ne vaut rien tant qu'il ne raconte rien. J'automatise la collecte, je nettoie, je croise, puis je construis l'interface qui rend l'information évidente — de mes propres séances de course aux données de vols du contrôle aérien.",
      tags: ["Python", "PowerBI", "Pandas", "Streamlit", "Visualisation"],
      projects: [
        {
          title: "Running Data — Streamlit",
          description:
            "Récupération automatisée de mes données d'entraînement et tableau de bord personnalisé pour analyser charge, allure et progression.",
          stack: ["Python", "Streamlit"],
          github: `${GITHUB}/Running-data-streamlit`,
        },
        {
          title: "Interface de données de vols — CRNA Est",
          description:
            "Développement en stage d'une interface exploitant des données de vols pour le centre de contrôle aérien.",
          stack: ["Data", "Interface"],
        },
        {
          title: "Tableau d'emprunts",
          description:
            "Génération d'un tableau d'emprunt et calcul des taux d'amortissement.",
          stack: ["Programmation"],
          github: `${GITHUB}/prog_tableau_emprunt`,
        },
      ],
    },
    {
      id: "bdd",
      label: "BDD",
      accent: "#a78bfa",
      title: "Des bases solides",
      pitch:
        "Ma spécialisation : la gestion et l'administration des bases de données. Modéliser proprement, écrire du SQL qui tient la charge, automatiser les règles métier en PL/SQL — parce qu'une application n'est jamais plus fiable que les données qu'elle repose dessus.",
      tags: ["SQL", "Oracle", "MySQL", "PL/SQL", "PHPMyAdmin", "Modélisation"],
      projects: [
        {
          title: "Gestion des soutenances",
          description:
            "Application de calendrier synchronisant étudiants et professeurs pour les examens de fin d'année. Validation automatique des créneaux en vérifiant dynamiquement la constitution des binômes d'enseignants.",
          stack: ["PHP", "SQL"],
          github: `${GITHUB}/Projet_organisation_soutenances`,
        },
        {
          title: "Réservation de logements pour alternants",
          description:
            "Plateforme de recherche de biens avec base de données, génération de données via fixtures, back-office d'administration et chatbot.",
          stack: ["PHP", "SQL", "Fixtures"],
          github: `${GITHUB}/Gestion_logements_etudiants`,
        },
      ],
    },
    {
      id: "web",
      label: "Dev Web",
      accent: "#22d3ee",
      title: "Du code qui se livre",
      pitch:
        "Avec Nathan, j'ai cofondé BressoDup : des sites vitrines sur mesure pour les PME et artisans de la Marne et des Ardennes, livrés en 18 jours avec un score Lighthouse 90+ garanti par contrat. Le web, je le pratique comme un produit, pas comme un exercice.",
      tags: ["React", "TypeScript", "JavaScript", "PHP", "HTML / CSS", "Git"],
      projects: [
        {
          title: "BressoDup — Agence web",
          description:
            "Micro-entreprise cofondée avec Nathan : sites vitrines React/TypeScript pour PME et artisans (Reims, Épernay, Charleville-Mézières), performance Lighthouse 90+ garantie, livraison en 18 jours.",
          stack: ["React", "TypeScript"],
          link: { label: "bressodup.fr", url: "https://bressodup.fr" },
        },
        {
          title: "Site d'information pour association",
          description:
            "Développement de l'application web d'une association pour informer son public.",
          stack: ["Web"],
        },
      ],
    },
    {
      id: "ai",
      label: "AI & ML",
      accent: "#f472b6",
      title: "Comprendre avant d'utiliser",
      pitch:
        "Je ne veux pas seulement appeler des modèles, je veux savoir les construire. Je suis le cours « Neural Networks: Zero to Hero » d'Andrej Karpathy — backpropagation, réseaux de neurones et modèles de langage codés à la main — après m'être fait la main sur les classiques du machine learning.",
      tags: ["Python", "PyTorch", "kNN", "Backpropagation", "scikit-learn"],
      projects: [
        {
          title: "Neural Networks: Zero to Hero",
          description:
            "Implémentation pas à pas des notebooks du cours d'Andrej Karpathy : micrograd, makemore, jusqu'aux modèles de langage. Dépôt en préparation.",
          stack: ["Python", "PyTorch"],
          status: "En cours",
        },
        {
          title: "Classification kNN — Titanic & Iris",
          description:
            "Implémentation de k plus proches voisins sur les jeux de données Titanic et Iris : préparation des données, choix de k, évaluation.",
          stack: ["Python", "kNN"],
        },
        {
          title: "Recommandation de films",
          description:
            "Interface Python suggérant dynamiquement des films selon un algorithme de tri et d'analyse.",
          stack: ["Python"],
          github: `${GITHUB}/Recommendation_film`,
        },
      ],
    },
    {
      id: "experience",
      label: "Expérience pro",
      accent: "#34d399",
      title: "Sur le terrain",
      pitch:
        "L'alternance et les stages sont l'endroit où la théorie rencontre de vraies contraintes : des utilisateurs, des délais, des données réelles. Contrôle aérien hier, industrie électrique aujourd'hui.",
      tags: ["Alternance", "Stage", "Industrie", "Aéronautique"],
      projects: [
        {
          title: "Alternant — Hager",
          period: "2026 – 2027",
          description:
            "3e année de BUT Informatique réalisée en alternance chez Hager, à Obernai.",
          stack: ["Alternance"],
        },
        {
          title: "Stagiaire développeur — CRNA Est",
          period: "Avril – Juillet 2026",
          description:
            "Développement d'une interface exploitant des données de vols au centre en-route de la navigation aérienne.",
          stack: ["Stage", "Data"],
        },
      ],
    },
    {
      id: "passions",
      label: "Tri & Échecs",
      accent: "#fb923c",
      title: "Endurance et stratégie",
      pitch:
        "Le triathlon m'apprend la régularité, les échecs la lecture du coup d'après. Course à pied et triathlon à bon niveau, parties d'échecs, 7 Wonders et Skull King entre amis — et des données d'entraînement que j'analyse comme n'importe quel autre dataset.",
      tags: ["Triathlon", "Course à pied", "Échecs", "7 Wonders", "Voyage"],
      projects: [
        {
          title: "Mes données d'entraînement",
          description:
            "Le code qui récupère et analyse mes séances de course et de triathlon.",
          stack: ["Python", "Streamlit"],
          github: `${GITHUB}/Running-data-streamlit`,
        },
      ],
    },
  ],

  // Section « Mon parcours » en bas de page, affichée en petit.
  parcours: {
    formation: [
      {
        title:
          "BUT Informatique — Gestion et administration des bases de données",
        place: "IUT RCC",
        period: "2025 – 2027",
        description:
          "3e année en alternance chez Hager. Poursuite d'études en Master.",
      },
      {
        title: "Cycle préparatoire à la formation d'ingénieur",
        place: "UTT",
        period: "2023 – 2025",
        description:
          "Deux années de prépa intégrée : rigueur et bases scientifiques approfondies.",
      },
      {
        title: "Baccalauréat général, mention Bien",
        place: "Lycée Marc Chagall",
        period: "2020 – 2023",
        description:
          "Option euro anglais. Spécialités Mathématiques, Physique-Chimie et Mathématiques expertes.",
      },
    ],
    experiences: [
      {
        title: "Stage technique",
        place: "SPIE Facilities",
        description:
          "Technicien de maintenance : diagnostic et réparation d'équipements mécaniques, maintenance préventive et curative.",
      },
      {
        title: "Responsable communication Junior",
        place: "Conseil UTT",
        description:
          "Organisation du concours d'éloquence de l'UTT 2025 et direction du pôle communication.",
      },
      {
        title: "Animateur",
        place: "Evad'Assoc",
        description:
          "Animation de deux colonies de vacances, la première seul et la seconde en équipe.",
      },
    ],
    autresProjets: [
      {
        title: "GameJam",
        description: "Jeu développé en Python lors d'une game jam.",
        github: `${GITHUB}/GameJam`,
      },
    ],
    langues: [
      { name: "Anglais", level: "Linguaskill C1+" },
      { name: "Espagnol", level: "Siele B2" },
    ],
    softSkills: [
      "Jovial",
      "À l'écoute",
      "Déterminé",
      "Dynamique",
      "Sportif",
      "Entrepreneur",
    ],
  },
};

export default arthurBresson;
