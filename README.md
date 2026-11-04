# Portfolio — Arthur Bresson

Portfolio personnel d'Arthur Bresson, étudiant en 3e année de BUT Informatique (parcours bases de données) et data analyst en alternance chez Hager : projets, compétences du BUT, parcours, sport et contact.

Le site s'adapte à l'écran, dans un thème dessiné à la main (papier crème, encre bleue, feutre rouge, polices droites Bricolage Grotesque pour les titres et Geist pour le texte, contours tremblés) :

- **Ordinateur (900 px et plus) : le dashboard.** Une grille 3×3 sans scroll, séparée par des traits fins. Six cases sont des graphiques qui filtrent les projets (frise du parcours, thèmes, compétences du BUT, technos, taille d'équipe, statut) ; les filtres se combinent. Les cases Sport et Contact ouvrent leur détail. La case centrale, deux fois plus grande que les autres et encadrée d'un trait d'encre, affiche l'accueil (la citation en grand, et un lien « Qui je suis » vers la présentation et le savoir-être), les projets filtrés, le sport ou le contact.
- **Téléphone et petite tablette : une page qui défile.** Une barre en haut avec un menu burger (sections numérotées, email, réseaux), puis l'accueil et cinq sections numérotées : 01 À propos (présentation et savoir-être), 02 Projets (un filtre par thème sur une rangée, les 6 plus récents puis « Afficher les autres »), 03 Parcours, 04 Hors code, 05 Contact et mentions légales. Pas de graphiques : ils sont réservés au dashboard.

Les anciens liens `?v=…` ouvrent simplement la version adaptée à l'écran.

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
public/                    favicons (svg, ico, png 96/192/512, manifest), apple-touch-icon, photo, robots.txt, sitemap.xml
seo/staticContent.js       plugin Vite : écrit le contenu en HTML dans index.html au build, pour les robots sans JavaScript
src/
├── App.jsx                choix de la version selon la largeur d'écran (dashboard ou mobile)
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
│   ├── mobile/            version mobile : app, barre du haut et menu burger, filtre par thème
│   ├── sections/          sections de la version mobile (hero, projets, à propos, parcours…)
│   └── ui/                Block, Button, Badge, Chip, icônes (dont AnimatedIcon), presets d'animation
├── hooks/                 useCopy, useElementWidth, useMediaQuery
└── styles/                tokens, global, ui, layout (version mobile), dataviz, dashboard
.claude/agents/            agent portfolio-review (jury Professeur / RH / Data Engineer)
.claude/skills/            skill-inspector (NVIDIA SkillSpector, Apache 2.0) : audit d'un skill avant installation
```

## Modifier le contenu

Tout le contenu se trouve dans `src/data/portfolio.js`. Il n'y a aucun composant à modifier : les graphiques, les filtres et les cartes sont calculés à partir de ces tableaux.

- Les dates sont au format `"AAAA-MM"`. `end: null` signifie « en cours », `start === end` un projet tenu dans le mois.
- Un projet a un `cadre` (UTT, IUT, Stage & alternance, Entreprise, Perso), un ou plusieurs `themes`, les `competences` du BUT qu'il prouve, une `stack`, et `team` s'il a été fait à plusieurs.
- `competences` liste les 6 compétences du BUT Informatique ; `parcours: true` marque celles du cœur du parcours data en 3e année (point bleu).
- Une période du `parcours` qui porte un `cadre` devient cliquable dans la frise et filtre les projets de ce cadre.
- `placeholder: true` réserve la place d'un projet pas encore publié : il est ignoré partout (graphiques, filtres, liste mobile).

## Relecture

L'agent `portfolio-review` (`.claude/agents/portfolio-review.md`) note le site sur 20 selon trois regards (Professeur, Recruteur RH, Data Engineer) et liste les corrections prioritaires. Dans Claude Code : « lance l'agent portfolio-review ».
