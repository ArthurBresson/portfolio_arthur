# Portfolio — Arthur Bresson

Portfolio personnel d'Arthur Bresson, étudiant en 3e année de BUT Informatique et alternant chez Hager : projets, compétences data & développement, parcours.

Page unique dont la hero est un réseau de neurones interactif : les neurones d'entrée (une bulle par section) se réorganisent au scroll pour former la navbar.

## Stack

- [React 19](https://react.dev) + [Vite](https://vite.dev) (avec le React Compiler)
- [Three.js](https://threejs.org) via [@react-three/fiber](https://r3f.docs.pmnd.rs) pour le réseau sur desktop, chargé en lazy
- Canvas 2D sur mobile et en fallback si WebGL échoue (animations réduites si `prefers-reduced-motion` est activé)
- CSS natif (variables dans `src/styles/tokens.css`)
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
public/                  favicon, photo, robots.txt
src/
├── App.jsx              page unique : hero + sections
├── data/arthurBresson.js  tout le contenu du portfolio
├── components/
│   ├── hero/            réseau de neurones (moteur, rendus Three.js / Canvas 2D)
│   └── sections/        sections de contenu, cartes projets, parcours, contact
├── hooks/               hooks partagés (useInView…)
└── styles/              tokens, styles globaux, hero et sections
```

## Modifier le contenu

Tout le contenu (profil, liens, sections, projets, parcours) se trouve dans `src/data/arthurBresson.js`, et aucun composant n'est à modifier.

Chaque entrée de `sections` correspond à la fois à un neurone d'entrée de la hero, à une bulle de la navbar et à une section de la page (ancre `#id`).
