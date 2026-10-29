/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import Button from "../ui/Button.jsx";
import ChartCard from "./ChartCard.jsx";
import { MailIcon, SocialIcon } from "../ui/Icons.jsx";

// Case échecs, langues et contact. « Me contacter » ouvre la vue contact
// au centre ; GitHub et LinkedIn sont des liens directs.
function ContactCard({
  profil,
  lifestyle,
  langues,
  pressed,
  onOpen,
  className = "",
  ...rest
}) {
  const echecs = lifestyle.find((item) => item.id === "echecs");
  const elo = echecs?.stats?.[0];

  return (
    <ChartCard
      title="Échecs, langues, contact"
      className={`contact-cell ${className}`.trim()}
      {...rest}
    >
      <div className="contact-cell-body">
        <dl className="contact-facts">
          {elo && (
            <div className="contact-fact contact-fact--elo">
              <dt>{elo.label}</dt>
              <dd className="tabular">{elo.value}</dd>
            </div>
          )}
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
