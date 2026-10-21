/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import AbReveal from "./AbReveal.jsx";
import { MailIcon, PinIcon, SocialIcon } from "./Icons.jsx";
import { trackSpotlight } from "./spotlight.js";

// Pied de page contact : email (mailto), réseaux, localisation.
const ContactFooter = ({ nom, email, socials = [], localisation }) => {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="ab-section ab-contact"
      aria-labelledby="contact-title"
    >
      <div className="ab-section__inner">
        <AbReveal
          className="ab-contact__panel ab-glass"
          onPointerMove={trackSpotlight}
        >
          <p className="ab-eyebrow">
            <span className="ab-eyebrow__number">@</span>
            <span className="ab-eyebrow__line" aria-hidden="true" />
            <span>Contact</span>
          </p>
          <h2 id="contact-title" className="ab-contact__title">
            Un projet, une alternance, une partie d&apos;échecs&nbsp;?
          </h2>

          {email && (
            <a className="ab-contact__email" href={`mailto:${email}`}>
              <MailIcon />
              <span>{email}</span>
            </a>
          )}

          <div className="ab-contact__row">
            {socials.length > 0 && (
              <ul className="ab-contact__socials" aria-label="Réseaux">
                {socials.map((social) => (
                  <li key={social.url}>
                    <a
                      className="ab-btn"
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} (nouvel onglet)`}
                    >
                      <SocialIcon label={social.label} />
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {localisation && (
              <p className="ab-contact__location">
                <PinIcon />
                {localisation}
              </p>
            )}
          </div>
        </AbReveal>

        <p className="ab-contact__legal">
          © {year} {nom}
        </p>
      </div>
    </footer>
  );
};

export default ContactFooter;
