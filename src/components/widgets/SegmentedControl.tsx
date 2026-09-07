export interface SegmentOption {
  id: string
  label: string
}

export function SegmentedControl({ options, value, onChange, ariaLabel, size = 'md' }: { options: SegmentOption[]; value: string; onChange: (id: string) => void; ariaLabel: string; size?: 'md' | 'lg' }) {
  return (
    <div className={`segmented segmented-${size}`} role="group" aria-label={ariaLabel}>
      {options.map((o) => (
        <button key={o.id} type="button" className="segmented-option" aria-pressed={o.id === value} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}
