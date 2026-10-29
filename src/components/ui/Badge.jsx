/* eslint-disable react/prop-types -- pas de dépendance prop-types dans le projet */
// Pastille. tone="gold" : réservé à l'excellence (records, perfs de course).
// tone="neutral" : étiquettes courantes (stack, cadre).
function Badge({ tone = "gold", className = "", children, ...rest }) {
  return (
    <span className={`badge badge--${tone} ${className}`.trim()} {...rest}>
      {children}
    </span>
  );
}

export default Badge;
