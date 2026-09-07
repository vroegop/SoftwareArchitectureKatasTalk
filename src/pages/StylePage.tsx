import { Link } from 'react-router-dom'
import type { PageProps } from '../app/pageComponents'
import { useSearchParamState } from '../app/useSearchParamState'
import { characteristics } from '../content/characteristics'
import { architectureStyles, styleById } from '../content/styles'
import type { CharacteristicId, StyleId } from '../content/types'
import { DiagramRenderer } from '../diagrams/DiagramRenderer'
import { PageShell } from '../components/shell/PageShell'
import { RadarChart } from '../components/widgets/RadarChart'
import { StarRating } from '../components/widgets/StarRating'
import { Tabs } from '../components/widgets/Tabs'

const average = Object.fromEntries(
  characteristics.map((c) => [c.id, architectureStyles.reduce((sum, s) => sum + s.ratings[c.id], 0) / architectureStyles.length]),
) as Record<CharacteristicId, number>

export default function StylePage({ page }: PageProps) {
  const style = styleById[page.param as StyleId]
  const [tab, setTab] = useSearchParamState('tab', 'topology')
  if (!style) return <PageShell page={page}>Unknown style.</PageShell>

  const aside = (
    <div className="stat-row">
      <span className="stat">
        <span className="stat-label">Family</span>
        <span className="stat-value">{style.family}</span>
      </span>
      <span className="stat">
        <span className="stat-label">Partitioning</span>
        <span className="stat-value">{style.partitioning}</span>
      </span>
      <span className="stat">
        <span className="stat-label">Quanta</span>
        <span className="stat-value">{style.quanta}</span>
      </span>
    </div>
  )

  return (
    <PageShell page={page} heroAside={aside}>
      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          {
            id: 'topology',
            label: 'Topology',
            render: () => (
              <div className="stage-split">
                <DiagramRenderer spec={style.topology} maxHeight="var(--stage-diagram-max)" />
                <div className="stack-sm">
                  {style.description.map((d) => (
                    <p key={d}>{d}</p>
                  ))}
                </div>
              </div>
            ),
          },
          {
            id: 'ratings',
            label: 'Ratings',
            render: () => (
              <div className="stage-split">
                <dl className="rating-rows">
                  {characteristics.map((c) => (
                    <div key={c.id}>
                      <dt>{c.label}</dt>
                      <StarRating value={style.ratings[c.id]} label={c.label} />
                      <dd>{c.description}</dd>
                    </div>
                  ))}
                </dl>
                <div className="stack-sm">
                  <RadarChart
                    series={[
                      { id: style.id, label: style.name, values: style.ratings },
                      { id: 'average', label: 'Average of the nine styles', values: average, role: 'reference' },
                    ]}
                    axes={characteristics}
                  />
                  <p className="small muted">Ratings as published in Fundamentals of Software Architecture, 2nd ed. ({style.reference.chapter}).</p>
                </div>
              </div>
            ),
          },
          {
            id: 'use',
            label: 'When to use, when to avoid',
            render: () => (
              <div className="stage-split-even stage-split">
                <section className="card stack-sm">
                  <p className="eyebrow">Reach for it when</p>
                  <ul className="bullets">
                    {style.whenToUse.map((u) => (
                      <li key={u}>{u}</li>
                    ))}
                  </ul>
                </section>
                <section className="card stack-sm">
                  <p className="eyebrow">Walk away when</p>
                  <ul className="bullets">
                    {style.whenToAvoid.map((u) => (
                      <li key={u}>{u}</li>
                    ))}
                  </ul>
                </section>
              </div>
            ),
          },
          {
            id: 'tradeoffs',
            label: 'Trade-offs and pitfalls',
            render: () => (
              <div className="grid-3">
                <section className="stack-sm">
                  <p className="eyebrow">Gains</p>
                  <ul className="bullets">
                    {style.tradeoffs.pro.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </section>
                <section className="stack-sm">
                  <p className="eyebrow">Costs</p>
                  <ul className="bullets">
                    {style.tradeoffs.con.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </section>
                <section className="stack-sm">
                  <p className="eyebrow">Pitfalls</p>
                  <ul className="bullets">
                    {style.pitfalls.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <p className="eyebrow">Seen in</p>
                  <ul className="bullets small">
                    {style.examples.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </section>
              </div>
            ),
          },
          {
            id: 'westhaven',
            label: 'Westhaven in this style',
            render: () => (
              <div className="stack measure">
                <p className="level-question">{style.westhaven}</p>
                <p>
                  <Link className="btn btn-sm" to="/case-design">
                    See the worked decision →
                  </Link>
                </p>
              </div>
            ),
          },
        ]}
      />
    </PageShell>
  )
}
