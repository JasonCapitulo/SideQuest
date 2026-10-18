function Button({ variant = 'primary', children, className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-bold transition-transform duration-150 active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2'

  const variants = {
    primary:
      'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] pixel-border',
    secondary:
      'bg-[var(--color-surface)] text-[var(--color-text)] border-2 border-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-white',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
