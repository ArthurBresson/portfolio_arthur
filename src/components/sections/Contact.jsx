/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Button from "../ui/Button.jsx";
import ClayCard from "../ui/ClayCard.jsx";
import Reveal from "../ui/Reveal.jsx";
import { CheckIcon, CopyIcon, MailIcon, SocialIcon } from "../ui/Icons.jsx";
import { springPress } from "../ui/motionPresets.js";

// Copie l'email ; si l'API presse-papier est indisponible, on sélectionne
// le texte pour que Ctrl+C suffise.
function useCopy(textReference) {
  const [copied, setCopied] = useState(false);
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      const node = textReference.current;
      if (!node) return;
      const range = document.createRange();
      range.selectNodeContents(node);
      const selection = globalThis.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  return [copied, copy];
}

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
          <ClayCard className="contact-card">
            <p className="section-kicker">Contact</p>
            <h2 id="contact-title" className="section-title">
              Écrivez-moi
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
          </ClayCard>
        </Reveal>

        <p className="footer-note">
          © {new Date().getFullYear()} {nom}
        </p>
      </div>
    </footer>
  );
}

export default Contact;
