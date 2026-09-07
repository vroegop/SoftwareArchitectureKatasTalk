import type { AgendaItem } from '../../content/widgets'

/** Horizontal run-of-show strip; segment widths are proportional to their duration. */
export function AgendaStrip({ items, total }: { items: AgendaItem[]; total: number }) {
  return (
    <ol className="agenda">
      {items.map((item, i) => {
        const next = items[i + 1]?.minute ?? total
        const width = Math.max(6, ((next - item.minute) / total) * 100)
        return (
          <li key={`${item.minute}-${item.label}`} className="agenda-item" style={{ flexGrow: width }}>
            <span className="agenda-minute mono">{item.minute}'</span>
            <span className="agenda-label">{item.label}</span>
          </li>
        )
      })}
    </ol>
  )
}
