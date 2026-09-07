import { useState } from 'react'
import type { PageProps } from '../app/pageComponents'
import { useSearchParamNumber } from '../app/useSearchParamState'
import { c4Abstractions, c4Levels, notationChecks, supplementaryDiagrams } from '../content/c4'
import { westhavenC1, westhavenC2, westhavenC3 } from '../content/example'
import { DiagramRenderer } from '../diagrams/DiagramRenderer'
import { PageShell } from '../components/shell/PageShell'
import { Stepper } from '../components/widgets/Stepper'

const levels = [
  { id: 'C1', spec: westhavenC1 },
  { id: 'C2', spec: westhavenC2 },
  { id: 'C3', spec: westhavenC3 },
] as const

/** Which notation checks the renderer can actually switch off for the demonstration. */
const TOGGLES: Record<string, 'showTitle' | 'showLegend' | 'showDescriptions' | 'showTech' | 'showEdgeLabels'> = {
  title: 'showTitle',
  legend: 'showLegend',
  'element-description': 'showDescriptions',
  technology: 'showTech',
  'line-intent': 'showEdgeLabels',
}

export default function C4Page({ page }: PageProps) {
  const [step, setStep] = useSearchParamNumber('level', 0)
  const [off, setOff] = useState<string[]>([])
  const level = levels[Math.min(step, levels.length - 1)]
  const info = c4Levels.find((l) => l.id === level.id) ?? c4Levels[0]
  const flags = Object.fromEntries(Object.entries(TOGGLES).map(([id, prop]) => [prop, !off.includes(id)])) as Record<
    (typeof TOGGLES)[string],
    boolean
  >
  const toggle = (id: string) => setOff(off.includes(id) ? off.filter((x) => x !== id) : [...off, id])

  return (
    <PageShell page={page}>
      <div className="stage-split">
        <DiagramRenderer key={level.id} spec={level.spec} maxHeight="var(--stage-diagram-max)" {...flags} />
        <div className="c4-controls">
          <Stepper
            steps={c4Levels
              .filter((l) => l.id !== 'C4')
              .map((l) => ({
                id: l.id,
                title: `${l.id} · ${l.name}`,
                render: () => (
                  <div className="level-card">
                    <p className="level-question">{l.question}</p>
                    <p className="small muted">For {l.audience}</p>
                    <ul className="bullets">
                      {l.shows.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                    <p className="small">
                      <strong>Tip.</strong> {l.tip}
                    </p>
                  </div>
                ),
              }))}
            active={step}
            onChange={setStep}
            compact
          />
          <section className="stack-sm">
            <div className="row-between">
              <p className="eyebrow">Notation checklist (c4model.com)</p>
              <span className="btn-group">
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => setOff(Object.keys(TOGGLES))}>
                  Sloppy diagram
                </button>
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => setOff([])}>
                  Fix it
                </button>
              </span>
            </div>
            <ul className="notation-list">
              {notationChecks.map((check) => {
                const toggleable = check.id in TOGGLES
                const isOff = off.includes(check.id)
                return (
                  <li key={check.id} className={isOff ? 'is-off' : undefined}>
                    <label title={toggleable ? 'Switch off to see what the diagram loses' : 'Built into this renderer'}>
                      <input type="checkbox" checked={!isOff} disabled={!toggleable} onChange={() => toggle(check.id)} />
                      <span className="notation-label">{check.label}</span>
                      <span className="notation-why">{check.why}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </section>
          <details className="small">
            <summary className="muted">The five abstractions and the supplementary diagrams</summary>
            <div className="stack-sm" style={{ marginTop: 8 }}>
              <dl className="vocab">
                {c4Abstractions.map((a) => (
                  <div key={a.name}>
                    <dt>{a.name}</dt>
                    <dd>{a.definition}</dd>
                  </div>
                ))}
              </dl>
              <p className="eyebrow">Supplementary</p>
              <ul className="bullets">
                {supplementaryDiagrams.map((d) => (
                  <li key={d.name}>
                    <strong>{d.name}.</strong> {d.use}
                  </li>
                ))}
              </ul>
              <p className="muted">
                {info.id} answers: {info.question}
              </p>
            </div>
          </details>
        </div>
      </div>
    </PageShell>
  )
}
