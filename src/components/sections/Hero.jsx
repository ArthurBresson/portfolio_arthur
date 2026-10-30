/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { motion } from "motion/react";
import Button from "../ui/Button.jsx";
import Block from "../ui/Block.jsx";
import Stat from "../ui/Stat.jsx";
import { DownloadIcon, MailIcon, PinIcon, SocialIcon } from "../ui/Icons.jsx";
import { springReveal } from "../ui/motionPresets.js";

// Mots entre astérisques dans `profil.accroche` => couleur de signature (encre bleue).
// Ex. : "Je code vite, *je finis ce que je commence.*"
// Sans astérisque, le titre s'affiche simplement.
function renderHighlight(text) {
  return text.split(/\*([^*]+)\*/).map((part, index) =>
    index % 2 === 1 ? (
      <em key={index} className="text-gold">
        {part}
      </em>
    ) : (
      part
    ),
  );
}

// Entrée du hero au chargement : courte, et sans opacité 0 pour que le
// premier affichage ne soit jamais vide.
const intro = {
  initial: { opacity: 0.4, y: 14 },
  animate: { opacity: 1, y: 0 },
};

function Hero({ profil, charts }) {
  const {
    nom,
    localisation,
    photo,
    socials = [],
    accroche,
    citation,
    preuves,
  } = profil;
  const hasPreuves = Array.isArray(preuves) && preuves.length > 0;

  return (
    <section id="accueil" className="hero" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <Block
          as="div"
          gold
          className="hero-card"
          {...intro}
          transition={springReveal}
        >
          <div className="hero-text">
            <h1 id="hero-title" className="hero-title">
              {accroche ? renderHighlight(accroche) : nom}
            </h1>

            {citation && (
              <figure className="hero-quote">
                <blockquote>
                  <p>« {citation.texte} »</p>
                </blockquote>
                <figcaption>{citation.auteur}</figcaption>
              </figure>
            )}

            <div className="hero-actions">
              <Button href="#contact" icon={<MailIcon />}>
                Me contacter
              </Button>
              <Button href="#projets" variant="soft">
                Voir les projets
              </Button>
              {profil.cv && (
                <Button
                  href={profil.cv}
                  download
                  variant="soft"
                  icon={<DownloadIcon />}
                >
                  Télécharger mon CV
                </Button>
              )}
            </div>

            <div className="hero-meta">
              {localisation && (
                <span className="hero-location">
                  <PinIcon />
                  {localisation}
                </span>
              )}
              <ul className="hero-socials" aria-label="Réseaux">
                {socials.map((social) => (
                  <li key={social.url}>
                    <Button
                      href={social.url}
                      external
                      variant="soft"
                      size="sm"
                      icon={<SocialIcon label={social.label} />}
                      aria-label={social.label}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {photo && (
            <motion.figure
              className="hero-photo"
              initial={{ opacity: 0.6, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...springReveal, delay: 0.08 }}
            >
              <img
                src={photo}
                alt={`Portrait de ${nom}`}
                width="512"
                height="512"
                fetchPriority="high"
              />
            </motion.figure>
          )}

          {hasPreuves && (
            <dl className="stat-list hero-proofs">
              {preuves.map((preuve) => (
                <Stat
                  key={preuve.label}
                  value={preuve.value}
                  label={preuve.label}
                  size="lg"
                  gold
                />
              ))}
            </dl>
          )}
        </Block>

        {/* Frise et thèmes : côte à côte sur desktop, empilés sur mobile. */}
        <div className="hero-charts">{charts}</div>
      </div>
    </section>
  );
}

export default Hero;
