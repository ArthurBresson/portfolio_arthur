/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import Button from "../ui/Button.jsx";
import AnimatedIcon from "../ui/AnimatedIcon.jsx";
import Block from "../ui/Block.jsx";
import Reveal from "../ui/Reveal.jsx";
import { CheckIcon, CopyIcon, MailIcon, SocialIcon } from "../ui/Icons.jsx";
import { springPress } from "../ui/motionPresets.js";
import { useCopy } from "../../hooks/useCopy.js";

const swap = {
  initial: { opacity: 0, y: 6, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -6, filter: "blur(2px)" },
};

function Contact({ profil }) {
  const { nom, email, socials = [] } = profil;
  const emailReference = useRef(null);
  const [copied, copy] = useCopy(emailReference);

  return (
    <footer
      id="contact"
      className="section contact"
      aria-labelledby="contact-title"
    >
      <div className="container">
        <Reveal>
          <Block className="contact-card">
            <p className="section-kicker">
              <AnimatedIcon name="mail" size={20} trigger="in" />
              Contact
            </p>
            <h2 id="contact-title" className="section-title">
              Écris-moi
            </h2>

            {email && (
              <div className="contact-email">
                <span ref={emailReference} className="contact-email-text">
                  {email}
                </span>
                <Button
                  variant="soft"
                  className="copy-button"
                  onClick={() => copy(email)}
                  aria-label={
                    copied ? "Adresse copiée" : "Copier l'adresse email"
                  }
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
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={copied ? "ok" : "copy"}
                      className="copy-label"
                      {...swap}
                      transition={springPress}
                    >
                      {copied ? "Copié" : "Copier"}
                    </motion.span>
                  </AnimatePresence>
                </Button>
                <span className="visually-hidden" role="status">
                  {copied ? "Adresse copiée dans le presse-papier" : ""}
                </span>
              </div>
            )}

            <div className="contact-actions">
              {email && (
                <Button href={`mailto:${email}`} icon={<MailIcon />}>
                  Envoyer un email
                </Button>
              )}
              {socials.map((social) => (
                <Button
                  key={social.url}
                  href={social.url}
                  external
                  variant="soft"
                  icon={<SocialIcon label={social.label} />}
                >
                  {social.label}
                </Button>
              ))}
            </div>
          </Block>
        </Reveal>

        <p className="footer-note">
          © {new Date().getFullYear()} {nom} · Icônes animées :{" "}
          <a href="https://lordicon.com/" target="_blank" rel="noreferrer">
            Lordicon
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Contact;
