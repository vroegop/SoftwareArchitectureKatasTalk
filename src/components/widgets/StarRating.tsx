const STAR = 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.2 1.3-6.6L2.5 9.4l6.6-.8z'

export function StarRating({ value, max = 5, label, size = 'md' }: { value: number; max?: number; label?: string; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <span className={`stars stars-${size}`} role="img" aria-label={`${label ? `${label}: ` : ''}${value} of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" aria-hidden="true">
          <path d={STAR} className={i < value ? 'star-on' : 'star-off'} />
        </svg>
      ))}
    </span>
  )
}
