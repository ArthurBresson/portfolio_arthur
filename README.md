# Portfolio — Arthur Bresson

Portfolio personnel d'Arthur Bresson, étudiant en 3e année de BUT Informatique (parcours bases de données) et alternant chez Hager : projets, parcours, sport et contact.

Le site existe en deux versions, à comparer en direct avec le bouton « Dashboard ⇄ Classique » :

- **Dashboard** (par défaut) : une grille 3×3 sans scroll sur desktop. Les 8 cases autour sont des graphiques (frise du parcours, thèmes, technos, années, taille d'équipe, statut, sport, contact) qui servent tous de filtre. Les filtres se combinent, et la case centrale affiche l'accueil, les projets filtrés, le détail sport ou le contact.
- **Classique** (`?v=classique`) : une page qui défile, avec hero, frise, graphique des thèmes, grille de projets filtrable, parcours, sport et contact.

## Stack

- [React 19](https://react.dev) + [Vite](https://vite.dev), avec le React Compiler
- [Motion](https://motion.dev) pour les animations (désactivées si `prefers-reduced-motion` est actif)
- Graphiques en SVG et CSS faits main, sans bibliothèque de charts
- CSS natif, variables dans `src/styles/tokens.css` (claymorphism « Tartan + or »)
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
├── App.jsx                choix de la version (paramètre ?v=) et bouton de bascule
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
│   └── ui/                ClayCard, Button, Badge, Chip, icônes, presets d'animation
├── hooks/                 useCopy, useElementWidth
└── styles/                tokens, global, ui, layout, dataviz, dashboard
.claude/agents/            agent portfolio-review (jury Professeur / RH / Data Engineer)
```

## Modifier le contenu

Tout le contenu se trouve dans `src/data/portfolio.js`. Il n'y a aucun composant à modifier : les graphiques, les filtres et les cartes sont calculés à partir de ces tableaux.

- Les dates sont au format `"AAAA-MM"`. `end: null` signifie « en cours ».
- Un projet a un `cadre` (UTT, IUT, Pro, Perso), un ou plusieurs `themes`, une `stack`, et `team` s'il a été fait à plusieurs.
- Une période du `parcours` qui porte un `cadre` devient cliquable dans la frise et filtre les projets de ce cadre.
- `placeholder: true` crée une carte « Bientôt en ligne » dans la version Classique, ignorée par les graphiques.

## Relecture

L'agent `portfolio-review` (`.claude/agents/portfolio-review.md`) note le site sur 20 selon trois regards (Professeur, Recruteur RH, Data Engineer) et liste les corrections prioritaires. Dans Claude Code : « lance l'agent portfolio-review ».
