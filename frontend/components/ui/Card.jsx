export const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border border-stone-200 bg-white shadow-soft ${className}`}>{children}</div>
);
