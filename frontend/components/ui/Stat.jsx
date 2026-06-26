export const Stat = ({ label, value }) => (
  <div className="rounded-md bg-mint/70 px-4 py-3">
    <div className="text-xs font-medium uppercase tracking-wide text-stone-600">{label}</div>
    <div className="mt-1 text-xl font-bold text-ink">{value}</div>
  </div>
);
