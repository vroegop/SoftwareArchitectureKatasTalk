import { Link } from 'react-router-dom'
import type { ArchitectureStyle, Characteristic, CharacteristicId } from '../../content/types'
import { StarRating } from './StarRating'

export interface CompareMatrixProps {
  styles: ArchitectureStyle[]
  characteristics: Characteristic[]
  sortBy?: CharacteristicId | null
  onSortBy?: (id: CharacteristicId | null) => void
  selected: string[]
  onToggleSelect: (id: string) => void
  maxSelected?: number
  linkStyles?: boolean
}

/** Sortable star matrix: nine styles by eleven characteristics, plus partitioning and quanta. */
export function CompareMatrix({ styles, characteristics, sortBy, onSortBy, selected, onToggleSelect, maxSelected = 3, linkStyles = true }: CompareMatrixProps) {
  const rows = sortBy ? [...styles].sort((a, b) => b.ratings[sortBy] - a.ratings[sortBy]) : styles
  const full = selected.length >= maxSelected
  return (
    <div className="table-wrap matrix-wrap" data-keys="local">
      <table className="table matrix">
        <thead>
          <tr>
            <th scope="col" className="matrix-style">
              <span className="visually-hidden">Compare</span> Style
            </th>
            <th scope="col">Partitioning</th>
            <th scope="col">Quanta</th>
            {characteristics.map((c) => (
              <th key={c.id} scope="col" className={sortBy === c.id ? 'is-sorted' : undefined} title={c.description}>
                <button type="button" className="matrix-sort" onClick={() => onSortBy?.(sortBy === c.id ? null : c.id)} aria-pressed={sortBy === c.id}>
                  {c.short}
                  {sortBy === c.id ? ' ▾' : ''}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => {
            const isSelected = selected.includes(s.id)
            return (
              <tr key={s.id} className={isSelected ? 'is-selected' : undefined}>
                <th scope="row" className="matrix-style">
                  <label className="matrix-pick">
                    <input type="checkbox" checked={isSelected} disabled={!isSelected && full} onChange={() => onToggleSelect(s.id)} aria-label={`Compare ${s.name}`} />
                    {linkStyles ? <Link to={`/styles/${s.id}`}>{s.name}</Link> : <span>{s.name}</span>}
                  </label>
                </th>
                <td className="small muted">{s.partitioning}</td>
                <td className="small muted">{s.quanta}</td>
                {characteristics.map((c) => (
                  <td key={c.id} className={sortBy === c.id ? 'is-sorted' : undefined}>
                    <StarRating value={s.ratings[c.id]} size="sm" label={`${s.name} ${c.label}`} />
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
