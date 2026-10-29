/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import Button from "../ui/Button.jsx";
import { CheckIcon, CopyIcon, MailIcon, SocialIcon } from "../ui/Icons.jsx";
import { springPress } from "../ui/motionPresets.js";
import { useCopy } from "../../hooks/useCopy.js";
import BackButton from "./BackButton.jsx";

const swap = {
  initial: { opacity: 0, y: 6, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -6, filter: "blur(2px)" },
};

// Vue contact de la case centrale : email copiable, liens, échecs, langues.
function ContactView({ profil, lifestyle, langues, hobbies, onBack }) {
  const { email, socials = [] } = profil;
  const emailReference = useRef(null);
  const [copied, copy] = useCopy(emailReference);
  const echecs = lifestyle.find((item) => item.id === "echecs");

  return (
    <div className="center-view detail-view">
      <h1 className="visually-hidden">Contacter Arthur Bresson</h1>
      <BackButton onBack={onBack} />
      <section className="contact-main">
        <h2 className="detail-title detail-title--big">Écris-moi</h2>
        <div className="contact-email">
          <span ref={emailReference} className="contact-email-text">
            {email}
          </span>
          <Button
            variant="soft"
            size="sm"
            onClick={() => copy(email)}
            aria-label={copied ? "Adresse copiée" : "Copier l'adresse email"}
            icon={
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={copied ? "ok" : "copy"}
                  className="copy-icon"
                  {...swap}
                  transition={springPress}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </motion.span>
              </AnimatePresence>
            }
          >
            {copied ? "Copié" : "Copier"}
          </Button>
          <span className="visually-hidden" role="status">
            {copied ? "Adresse copiée dans le presse-papier" : ""}
          </span>
        </div>
        <div className="contact-actions">
          <Button href={`mailto:${email}`} size="sm" icon={<MailIcon />}>
            Envoyer un email
          </Button>
          {socials.map((social) => (
            <Button
              key={social.url}
              href={social.url}
              external
              variant="soft"
              size="sm"
              icon={<SocialIcon label={social.label} />}
            >
              {social.label}
            </Button>
          ))}
        </div>
      </section>
      <div className="detail-grid">
        {echecs && (
          <section className="detail-block">
            <h3 className="detail-title">Échecs</h3>
            <p className="detail-apport">{echecs.apport}</p>
          </section>
        )}
        <section className="detail-block">
          <h3 className="detail-title">Langues et loisirs</h3>
          <dl className="lang-list">
            {langues.map((langue) => (
              <div key={langue.name} className="lang">
                <dt>{langue.name}</dt>
                <dd>{langue.level}</dd>
              </div>
            ))}
          </dl>
          <p className="detail-note">{hobbies.join(" · ")}</p>
        </section>
      </div>
    </div>
  );
}

export default ContactView;
