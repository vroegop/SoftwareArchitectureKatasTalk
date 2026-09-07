import type { PageProps } from '../app/pageComponents'
import { useSearchParamList, useSearchParamState } from '../app/useSearchParamState'
import { characteristics } from '../content/characteristics'
import { architectureStyles, styleById } from '../content/styles'
import type { CharacteristicId, StyleId } from '../content/types'
import { PageShell } from '../components/shell/PageShell'
import { CompareMatrix } from '../components/widgets/CompareMatrix'
import { RadarChart } from '../components/widgets/RadarChart'
import { StarRating } from '../components/widgets/StarRating'
import { Tabs } from '../components/widgets/Tabs'

const characteristicIds = new Set(characteristics.map((c) => c.id as string))

export default function StarRatingsPage({ page }: PageProps) {
  const [sortRaw, setSort] = useSearchParamState('sort', '')
  const [compare, setCompare] = useSearchParamList('compare')
  const [view, setView] = useSearchParamState('view', 'matrix')
  const sortBy = characteristicIds.has(sortRaw) ? (sortRaw as CharacteristicId) : null
  const selected = compare.filter((id) => id in styleById)
  const series = selected.map((id) => {
    const s = styleById[id as StyleId]
    return { id: s.id, label: s.name, values: s.ratings }
  })

  return (
    <PageShell page={page}>
      <div className="stack">
        <div className="row-between small muted">
          <span className="row">
            <StarRating value={1} size="sm" label="one star" /> weak point · <StarRating value={5} size="sm" label="five stars" /> strength · overall cost: more stars is cheaper
          </span>
          <span>Ratings as published in Fundamentals of Software Architecture, 2nd ed. (Richards &amp; Ford, O’Reilly)</span>
        </div>
        <Tabs
          active={view}
          onChange={setView}
          tabs={[
            {
              id: 'matrix',
              label: 'Matrix',
              render: () => (
                <CompareMatrix
                  styles={architectureStyles}
                  characteristics={characteristics}
                  sortBy={sortBy}
                  onSortBy={(id) => setSort(id ?? null)}
                  selected={selected}
                  onToggleSelect={(id) => setCompare(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])}
                />
              ),
            },
            {
              id: 'radar',
              label: `Radar (${selected.length} selected)`,
              render: () =>
                series.length > 0 ? (
                  <div className="stage-split">
                    <RadarChart series={series} axes={characteristics} />
                    <div className="stack-sm">
                      <p className="eyebrow">Reading the shape</p>
                      <p>A wide shape is a generalist; a spiky one has been optimised for something. The stars rank the same trade-offs the room just argued about.</p>
                      <ul className="bullets">
                        {series.map((s) => (
                          <li key={s.id}>
                            <strong>{s.label}</strong>: {styleById[s.id as StyleId].tagline}
                          </li>
                        ))}
                      </ul>
                      <button type="button" className="btn btn-sm btn-ghost" onClick={() => setCompare([])}>
                        Clear selection
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="muted">Tick up to three styles in the matrix to overlay them here.</p>
                ),
            },
          ]}
        />
      </div>
    </PageShell>
  )
}
