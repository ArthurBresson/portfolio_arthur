# Portfolio — Arthur Bresson

Portfolio personnel d'Arthur Bresson, étudiant en 3e année de BUT Informatique (parcours bases de données) et data analyst en alternance chez Hager : projets, compétences du BUT, parcours, sport et contact.

Le site existe en deux versions, à comparer en direct avec les boutons 1 et 2, toutes deux dans un thème dessiné à la main (papier crème, encre bleue, feutre rouge, polices manuscrites Kalam et Patrick Hand, contours tremblés) :

- **1 — Dashboard** (par défaut) : une grille 3×3 sans scroll sur desktop, séparée par des traits fins. Six cases sont des graphiques qui filtrent les projets (frise du parcours, thèmes, compétences du BUT, technos, taille d'équipe, statut) ; les filtres se combinent. Les cases Sport et Contact ouvrent leur détail. La case centrale affiche l'accueil (la citation en grand, et un lien « Qui je suis » vers la présentation et le savoir-être), les projets filtrés, le sport ou le contact.
- **2 — Classique** (`?v=2`) : une page qui défile, avec le hero (frise et graphique des thèmes compris), l'index des projets filtrable, « À propos » (présentation et savoir-être), le parcours, le sport, puis le contact et les mentions légales.

Les anciens liens restent valides : `?v=3` mène à la version 1, `?v=4` et `?v=classique` à la version 2.

## Stack

- [React 19](https://react.dev) + [Vite](https://vite.dev), avec le React Compiler
- [Motion](https://motion.dev) pour les animations (désactivées si `prefers-reduced-motion` est actif)
- Graphiques en SVG et CSS faits main, sans bibliothèque de charts
- CSS natif, variables dans `src/styles/tokens.css` (thème « Dessiné »). Pas de cartes ni d'ombres : des traits d'encre et de l'espace
- Icônes animées [Lordicon](https://lordicon.com) (`@lordicon/react`), hébergées avec le site dans `src/assets/lordicon` et chargées à la demande. La licence gratuite demande un crédit : il est dans le pied de page et dans la vue Contact du dashboard
- Déploiement sur [Vercel](https://vercel.com)

## Démarrage

```bash
npm install
npm run dev       # serveur de développement
npm run build     # build de production dans dist/
npm run preview   # prévisualiser le build
npm run lint      # ESLint
```

## Structure

```
public/                    favicon, apple-touch-icon, photo, robots.txt
src/
├── App.jsx                choix de la version (paramètre ?v=1 ou 2) et boutons de bascule
├── assets/lordicon/       animations Lordicon (JSON)
├── data/portfolio.js      tout le contenu : profil, parcours, projets, sport, langues
├── lib/
│   ├── filters.js         filtre croisé (axes, correspondances, comptes « x/total »)
│   ├── dimensions.js      options de chaque axe, calculées depuis les données
│   ├── dates.js           mise en forme des dates "AAAA-MM"
│   └── intro.js           mémoire de l'intro et du tutoriel (storage protégé)
├── components/
│   ├── dashboard/         grille de la version Dashboard
│   ├── dataviz/           graphiques du Dashboard, intro, tutoriel
│   ├── center/            vues de la case centrale (accueil, projets, sport, contact, « Qui je suis »)
│   ├── classic/           version Classique : app, frise, thèmes, filtres
│   ├── sections/          sections de la version Classique
│   └── ui/                Block, Button, Badge, Chip, icônes (dont AnimatedIcon), presets d'animation
├── hooks/                 useCopy, useElementWidth
└── styles/                tokens, global, ui, layout, dataviz, dashboard
.claude/agents/            agent portfolio-review (jury Professeur / RH / Data Engineer)
.claude/skills/            skill-inspector (NVIDIA SkillSpector, Apache 2.0) : audit d'un skill avant installation
```

## Modifier le contenu

Tout le contenu se trouve dans `src/data/portfolio.js`. Il n'y a aucun composant à modifier : les graphiques, les filtres et les cartes sont calculés à partir de ces tableaux.

- Les dates sont au format `"AAAA-MM"`. `end: null` signifie « en cours », `start === end` un projet tenu dans le mois.
- Un projet a un `cadre` (UTT, IUT, Stage & alternance, Entreprise, Perso), un ou plusieurs `themes`, les `competences` du BUT qu'il prouve, une `stack`, et `team` s'il a été fait à plusieurs.
- `competences` liste les 6 compétences du BUT Informatique ; `parcours: true` marque celles du cœur du parcours data en 3e année (point bleu).
- Une période du `parcours` qui porte un `cadre` devient cliquable dans la frise et filtre les projets de ce cadre.
- `placeholder: true` crée une carte « Bientôt en ligne » dans la version Classique, ignorée par les graphiques.

## Relecture

L'agent `portfolio-review` (`.claude/agents/portfolio-review.md`) note le site sur 20 selon trois regards (Professeur, Recruteur RH, Data Engineer) et liste les corrections prioritaires. Dans Claude Code : « lance l'agent portfolio-review ».
