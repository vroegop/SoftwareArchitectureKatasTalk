import { Link } from 'react-router-dom'
import type { PageProps } from '../app/pageComponents'
import { useSearchParamList, useSearchParamState } from '../app/useSearchParamState'
import { characteristics, characteristicById } from '../content/characteristics'
import { architectureStyles, styleById } from '../content/styles'
import type { ArchitectureStyle, CharacteristicId, StyleId } from '../content/types'
import { DiagramRenderer } from '../diagrams/DiagramRenderer'
import { PageShell } from '../components/shell/PageShell'
import { StarRating } from '../components/widgets/StarRating'

function rankedCharacteristics(style: ArchitectureStyle): [CharacteristicId, number][] {
  return (Object.entries(style.ratings) as [CharacteristicId, number][]).sort((a, b) => b[1] - a[1])
}

function StyleCard({ style, selected, compared, onSelect }: { style: ArchitectureStyle; selected: boolean; compared: boolean; onSelect: () => void }) {
  const ranked = rankedCharacteristics(style)
  return (
    <button type="button" className={`style-card${selected ? ' is-selected' : ''}${compared ? ' is-compared' : ''}`} onClick={onSelect} aria-pressed={selected}>
      <span className="style-card-name">{style.name}</span>
      <span className="style-thumb">
        <DiagramRenderer spec={style.topology} showTitle={false} showLegend={false} hideText />
      </span>
      <span className="row">
        <span className="chip chip-ok">▲ {characteristicById[ranked[0][0]].short}</span>
        <span className="chip chip-danger">▼ {characteristicById[ranked[ranked.length - 1][0]].short}</span>
      </span>
    </button>
  )
}

export default function StylesPage({ page }: PageProps) {
  const [selectedId, setSelected] = useSearchParamState('style', '')
  const [compare, setCompare] = useSearchParamList('compare')
  const selected = architectureStyles.find((s) => s.id === selectedId)
  const compared = compare.filter((id) => id in styleById) as StyleId[]

  const families = [
    { id: 'monolithic', label: 'Monolithic: one deployment unit', styles: architectureStyles.filter((s) => s.family === 'monolithic') },
    { id: 'distributed', label: 'Distributed: many deployment units', styles: architectureStyles.filter((s) => s.family === 'distributed') },
  ]

  const toggleCompare = (id: StyleId) => {
    if (compared.includes(id)) setCompare(compared.filter((x) => x !== id))
    else if (compared.length < 3) setCompare([...compared, id])
  }

  return (
    <PageShell page={page}>
      <div className="stage-split">
        <div className="gallery">
          {families.map((family) => (
            <section key={family.id} className="gallery-family">
              <p className="eyebrow">{family.label}</p>
              <div className="gallery-grid">
                {family.styles.map((style) => (
                  <StyleCard key={style.id} style={style} selected={selected?.id === style.id} compared={compared.includes(style.id)} onSelect={() => setSelected(selected?.id === style.id ? null : style.id)} />
                ))}
              </div>
            </section>
          ))}
        </div>
        <aside className="style-drawer">
          {selected ? (
            <div className="card stack fade-in" key={selected.id}>
              <div>
                <p className="eyebrow">{selected.family} · {selected.reference.chapter}</p>
                <h3 className="card-title">{selected.name}</h3>
                <p className="muted">{selected.tagline}</p>
              </div>
              <div className="stat-row">
                <span className="stat">
                  <span className="stat-label">Partitioning</span>
                  <span className="stat-value">{selected.partitioning}</span>
                </span>
                <span className="stat">
                  <span className="stat-label">Quanta</span>
                  <span className="stat-value">{selected.quanta}</span>
                </span>
              </div>
              <p>{selected.description[0]}</p>
              <dl className="rating-rows">
                {rankedCharacteristics(selected)
                  .filter((_, i, all) => i < 3 || i >= all.length - 2)
                  .map(([id, value]) => (
                    <div key={id}>
                      <dt>{characteristicById[id].label}</dt>
                      <StarRating value={value} size="sm" />
                      <dd>{value >= 4 ? 'strength' : value <= 2 ? 'weak point' : 'average'}</dd>
                    </div>
                  ))}
              </dl>
              <div className="btn-group">
                <Link className="btn btn-primary" to={`/styles/${selected.id}`}>
                  Open the deep dive ↓
                </Link>
                <button type="button" className="btn" aria-pressed={compared.includes(selected.id)} onClick={() => toggleCompare(selected.id)} disabled={!compared.includes(selected.id) && compared.length >= 3}>
                  {compared.includes(selected.id) ? 'In comparison' : 'Compare'}
                </button>
              </div>
            </div>
          ) : (
            <p className="muted">Click a style for a summary, add up to three to a comparison. Forward walks into the nine deep-dive pages.</p>
          )}
          {compared.length > 0 ? (
            <div className="card card-sm stack-sm">
              <div className="row-between">
                <p className="eyebrow">Side by side</p>
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => setCompare([])}>
                  Clear
                </button>
              </div>
              <div className="table-wrap">
                <table className="table compare-table">
                  <thead>
                    <tr>
                      <th scope="col">Characteristic</th>
                      {compared.map((id) => (
                        <th key={id} scope="col">
                          {styleById[id].name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {characteristics.map((c) => (
                      <tr key={c.id}>
                        <td>{c.label}</td>
                        {compared.map((id) => (
                          <td key={id}>
                            <StarRating value={styleById[id].ratings[c.id]} size="sm" label={`${styleById[id].name} ${c.label}`} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </PageShell>
  )
}
