export const EmptyState = ({ icon: Icon, title, body, action }) => (
  <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center">
    {Icon ? <Icon className="mx-auto mb-3 h-8 w-8 text-moss" aria-hidden="true" /> : null}
    <h2 className="text-lg font-semibold text-ink">{title}</h2>
    {body ? <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">{body}</p> : null}
    {action ? <div className="mt-5">{action}</div> : null}
  </div>
);
