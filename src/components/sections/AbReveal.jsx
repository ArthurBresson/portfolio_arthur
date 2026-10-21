/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
import { useInView } from "../../hooks/useInView.js";

// Apparition douce au scroll (fondu + léger glissement), propre à la page
// Arthur. `delay` (ms) échelonne les éléments, `as` choisit la balise.
const AbReveal = ({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  style,
  ...rest
}) => {
  const [reference, isInView] = useInView({ threshold: 0.12 });

  return (
    <Tag
      ref={reference}
      className={`ab-reveal ${isInView ? "is-visible" : ""} ${className}`.trim()}
      style={{ ...style, "--ab-reveal-delay": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default AbReveal;
