# Portfolio — Arthur Bresson

Portfolio personnel d'Arthur Bresson, étudiant en 3e année de BUT Informatique (parcours bases de données) et data analyst en alternance chez Hager : projets, compétences du BUT, parcours, sport et contact.

Le site existe en quatre versions, à comparer en direct avec les boutons 1 à 4 :

| Version | Mise en page | Thème |
| --- | --- | --- |
| 1 (par défaut) | Dashboard | « Tartan + or », clair |
| 2 (`?v=2`) | Classique | « Tartan + or », clair |
| 3 (`?v=3`) | Dashboard | « Dessiné », papier et encre, à main levée |
| 4 (`?v=4`) | Classique | « Dessiné », papier et encre, à main levée |

- **Dashboard** : une grille 3×3 sans scroll sur desktop, séparée par des filets fins. Six cases sont des graphiques qui filtrent les projets (frise du parcours, thèmes, compétences du BUT, technos, taille d'équipe, statut) ; les filtres se combinent. Les cases Sport et Contact ouvrent leur détail. La case centrale affiche l'accueil (la citation en grand), les projets filtrés, le sport ou le contact.
- **Classique** : une page qui défile, avec hero, frise, graphique des thèmes, index des projets filtrable, parcours, sport et contact.

Les deux thèmes partagent les mêmes composants : le thème dessiné ne redéfinit que les tokens (couleurs, arrondis tremblés, polices : `:root[data-theme="sketch"]` dans `src/styles/tokens.css`). Ses polices manuscrites (Kalam, Patrick Hand) ne sont chargées que lorsqu'on l'affiche. Les anciens liens `?v=classique` mènent à la version 2.

## Stack

- [React 19](https://react.dev) + [Vite](https://vite.dev), avec le React Compiler
- [Motion](https://motion.dev) pour les animations (désactivées si `prefers-reduced-motion` est actif)
- Graphiques en SVG et CSS faits main, sans bibliothèque de charts
- CSS natif, variables dans `src/styles/tokens.css`. Mise en page éditoriale : pas de cartes ni d'ombres, des filets fins et de l'espace
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
├── App.jsx                choix de la version (paramètre ?v=1 à 4) et boutons de bascule
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
│   ├── center/            vues de la case centrale (accueil, projets, sport, contact)
│   ├── classic/           version Classique : app, frise, thèmes, filtres
│   ├── sections/          sections de la version Classique
│   └── ui/                Block, Button, Badge, Chip, icônes (dont AnimatedIcon), presets d'animation
├── hooks/                 useCopy, useElementWidth
└── styles/                tokens, global, ui, layout, dataviz, dashboard
.claude/agents/            agent portfolio-review (jury Professeur / RH / Data Engineer)
```

## Modifier le contenu

Tout le contenu se trouve dans `src/data/portfolio.js`. Il n'y a aucun composant à modifier : les graphiques, les filtres et les cartes sont calculés à partir de ces tableaux.

- Les dates sont au format `"AAAA-MM"`. `end: null` signifie « en cours », `start === end` un projet tenu dans le mois.
- Un projet a un `cadre` (UTT, IUT, Stage & alternance, Entreprise, Perso), un ou plusieurs `themes`, les `competences` du BUT qu'il prouve, une `stack`, et `team` s'il a été fait à plusieurs.
- `competences` liste les 6 compétences du BUT Informatique ; `parcours: true` marque celles du cœur du parcours data en 3e année (point doré).
- Une période du `parcours` qui porte un `cadre` devient cliquable dans la frise et filtre les projets de ce cadre.
- `placeholder: true` crée une carte « Bientôt en ligne » dans la version Classique, ignorée par les graphiques.

## Relecture

L'agent `portfolio-review` (`.claude/agents/portfolio-review.md`) note le site sur 20 selon trois regards (Professeur, Recruteur RH, Data Engineer) et liste les corrections prioritaires. Dans Claude Code : « lance l'agent portfolio-review ».
