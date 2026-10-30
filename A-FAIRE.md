# Portfolio : ce qu'il reste à faire

Point au 30 octobre 2026.

## Attention : rien n'est commité

Tout le travail de la session est dans la copie de travail, sans commit. Le dernier commit poussé est `d237ca1` (en-têtes de sécurité). Ce qui attend un commit :

- les compétences du BUT en coches (plus de barres ni de « 2/15 ») ;
- le sélecteur à 4 versions (`?v=1` à `?v=4`) ;
- la mise en page sans cartes : des filets fins, pas d'ombres ;
- les icônes animées Lordicon, hébergées dans `src/assets/lordicon` ;
- le thème dessiné à la main (versions 3 et 4) ;
- les corrections des deux passages du jury : frise sans le Bac, contrastes, nom visible sur mobile, tri des projets, etc. ;
- GameJam en janvier 2026 et Gestion des soutenances en mai-juin 2025 ;
- la suppression de la preuve « 13 projets en trois ans » ;
- la ligne unique cadre + dates + compétences sur chaque projet ;
- les dashboards sans phrases d'aide sous les titres.

Avant de commiter, ouvre `npm run dev` et vérifie les 4 versions.

## Décision prise

Ne garder que les 2 versions dessinées à la main (dashboard et classique) et supprimer les 2 versions « Tartan + or ». C'est l'étape 1 du prompt plus bas.

## Ce qui manque par rapport au site de Nathan (nathanduport.com)

1. **Une section « Savoir-être ».** C'est ce que Nathan entend par « incomplet ». Il montre trois qualités, chacune avec une preuve. Proposition, écrite à partir de faits déjà sur le site :
   - **Communication** : « Responsable communication au conseil de l'UTT : j'ai organisé le concours d'éloquence 2025 et dirigé le pôle communication. »
   - **Organisation** : « Alternance chez Hager, BUT, BressoDup et entraînements de triathlon dans la même semaine. Je planifie chaque créneau, et j'ai quand même gagné 15 minutes entre mes deux triathlons M. »
   - **Travail en équipe** : « Animateur en colonie, d'abord seul avec un groupe, puis en équipe. Côté code, CoLive à cinq et Running Data à quatre. »
2. **Une présentation en quelques phrases**, dans sa propre section, pas à l'accueil : qui je suis, ce que je fais le jour et le soir, ce que ça m'apprend.
3. **Un parcours détaillé** : 3 ou 4 lignes « ce que j'y fais » par expérience, avec les technos. Hager et le stage CRNA en priorité.
4. **Un bouton « Télécharger mon CV »** (PDF à mettre dans `public/`).
5. **« Français : natif »** dans les langues.
6. **Des mentions légales.** En tant qu'auto-entrepreneur, c'est en principe obligatoire (LCEN) : éditeur, hébergeur (Vercel), contact.

À garder tel quel, c'est ce qui me distingue : les graphiques filtrables, les preuves chiffrées, le sport présenté en données. Ne pas reprendre les slogans de Nathan.

## Questions à trancher (mes réponses)

**Pour la section « Savoir-être » et le parcours**
- [ ] Les trois qualités proposées me ressemblent-elles ? Une autre est-elle plus forte (pédagogie, persévérance, sang-froid…) ?
- [ ] Hager : 3 ou 4 choses concrètes que je fais, et les outils (SQL, DAX, Python ?).
- [ ] Stage CRNA : langages, frameworks, bases de données, ce que j'ai livré.
- [ ] BressoDup : mon rôle exact dans le duo. Statut : micro-entreprise ou société ? Combien de sites livrés ? Le délai de 18 jours a-t-il été tenu pour un vrai client ? Un lien vers une réalisation ?
- [ ] Mon CV en PDF.
- [ ] Mentions légales : SIRET à afficher ou non.

**Restées ouvertes après le jury**
- [ ] « Administrer » : quel projet le prouve ? Elle est cochée sans projet.
- [ ] CRNA, Hager, Saint-Léonard : seul ou en équipe (taille) ? Aujourd'hui, ils comptent comme « Seul ».
- [ ] Fusionner `SQL` et `PostgreSQL` dans les technos ?
- [ ] GameJam : le jeu s'appelle « Dimensional Pulse » d'après le site de Nathan ; thème imposé, bibliothèque (Pygame ?).
- [ ] Les dates exactes de Recommandation de films, kNN, CoLive, Tableau d'emprunt et Running Data.
- [ ] La techno du site de Saint-Léonard (CMS, framework, hébergement).
- [ ] Les deux cartes « Bientôt en ligne » : quels projets IUT, ou faut-il les retirer ?
- [ ] « −15 min » : Épernay et Madine sont deux parcours différents. Est-ce que je garde la comparaison comme une progression ?
- [ ] Remplacer « Chaque défaite m'apprend… » (échecs) et « Quand une séance rate… » (course) par un fait concret.

## Prompt à coller dans Claude Code

```text
Lis A-FAIRE.md à la racine du dépôt, puis fais ceci dans l'ordre. Applique le skill humanizer à tout texte que tu écris, et n'invente aucun fait : s'il manque une info, demande-la-moi.

1. Commite d'abord l'état actuel tel quel (sans pousser), pour pouvoir revenir en arrière.

2. Ne garde que le thème dessiné à la main (« sketch ») et supprime le thème « Tartan + or » :
   - les tokens de `:root[data-theme="sketch"]` deviennent ceux de `:root` dans src/styles/tokens.css ; supprime les tokens Tartan et les règles propres au thème sketch qui ne servent plus de surcharge ;
   - charge les polices Kalam et Patrick Hand directement dans index.html à la place de Bricolage Grotesque et Figtree, et retire loadSketchFonts, THEME_META et applyTheme de src/App.jsx s'ils ne servent plus ;
   - le sélecteur passe à 2 versions : 1 = Dashboard, 2 = Classique. Les anciens liens restent valides : ?v=3 mène à 1, ?v=4 et ?v=classique mènent à 2 ;
   - mets à jour theme-color et color-scheme dans index.html, le README et ma mémoire du projet.

3. Avec mes réponses aux questions de A-FAIRE.md (demande-les-moi si la liste n'est pas remplie) :
   - ajoute une section « Savoir-être » (trois qualités, chacune avec une preuve) dans la version classique et dans une vue du dashboard ;
   - ajoute un court paragraphe de présentation dans sa propre section (pas à l'accueil) ;
   - détaille le parcours (3 ou 4 lignes par expérience, avec les technos) ;
   - ajoute le bouton « Télécharger mon CV », « Français : natif » et les mentions légales.

4. Vérifie : npm run lint, npm run build, captures des 2 versions en 1440×900 et 390×844, aucune erreur dans la console avec la CSP de vercel.json, aucune case du dashboard qui déborde.

5. Lance l'agent portfolio-review, corrige ce qui est objectif, et liste-moi le reste.

6. Ne commite et ne pousse le résultat final qu'après mon accord.
```
