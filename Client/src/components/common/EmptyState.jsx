export default function EmptyState({
  icon: Icon,
  title = "Nothing here yet",
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-paper-line bg-paper-raised/60 px-6 py-14 text-center">
      {Icon ? (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-gold-600">
          <Icon size={22} strokeWidth={1.75} />
        </span>
      ) : null}
      <h3 className="font-display text-lg text-ink">{title}</h3>
      {description ? (
        <p className="max-w-sm text-sm text-ink-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
