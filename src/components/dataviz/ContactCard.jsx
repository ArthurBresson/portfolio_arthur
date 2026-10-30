/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import Button from "../ui/Button.jsx";
import ChartCard from "./ChartCard.jsx";
import { MailIcon, SocialIcon } from "../ui/Icons.jsx";

// Case langues et contact. « Me contacter » ouvre la vue contact au
// centre (avec les échecs et les loisirs) ; GitHub et LinkedIn sont des
// liens directs.
function ContactCard({
  profil,
  langues,
  pressed,
  onOpen,
  className = "",
  ...rest
}) {
  return (
    <ChartCard
      title="Langues et contact"
      icon="mail"
      className={`contact-cell ${className}`.trim()}
      {...rest}
    >
      <div className="contact-cell-body">
        <dl className="contact-facts">
          {langues.map((langue) => (
            <div key={langue.name} className="contact-fact">
              <dt>{langue.name}</dt>
              <dd>{langue.level.split(" ")[0]}</dd>
            </div>
          ))}
        </dl>
        <div className="contact-cell-actions">
          <Button
            size="sm"
            icon={<MailIcon />}
            aria-pressed={pressed}
            onClick={onOpen}
          >
            Me contacter
          </Button>
          {profil.socials.map((social) => (
            <Button
              key={social.url}
              href={social.url}
              external
              variant="soft"
              size="sm"
              icon={<SocialIcon label={social.label} />}
              aria-label={social.label}
            />
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

export default ContactCard;
