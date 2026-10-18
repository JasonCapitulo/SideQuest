function Card({ title, icon, children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm ${className}`}
    >
      {title && (
        <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-[var(--color-text)]">
          {icon && <span aria-hidden="true">{icon}</span>}
          {title}
        </h3>
      )}
      <div className="text-[var(--color-text-soft)]">{children}</div>
    </div>
  )
}

export default Card
