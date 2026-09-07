import { useState } from 'react'
import type { PageProps } from '../app/pageComponents'
import { useStepIndex } from '../app/stepParams'
import { c4Abstractions, c4Levels, notationChecks, supplementaryDiagrams } from '../content/c4'
import { westhavenC1, westhavenC2, westhavenC3 } from '../content/example'
import { DiagramRenderer } from '../diagrams/DiagramRenderer'
import { PageShell } from '../components/shell/PageShell'
import { Stepper, type StepDef } from '../components/widgets/Stepper'

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
const ALL_OFF = Object.keys(TOGGLES)
const SLOPPY = 3
const FIXED = 4
const STEP_COUNT = 5

export default function C4Page({ page }: PageProps) {
  const [step, setStep] = useStepIndex('step', STEP_COUNT)
  // Manual checkbox changes override the step's preset until the step changes.
  const [manual, setManual] = useState<{ step: number; off: string[] } | null>(null)
  const preset = step === SLOPPY ? ALL_OFF : step === FIXED ? [] : []
  const off = manual && manual.step === step ? manual.off : preset
  const level = step < levels.length ? levels[step] : levels[1]
  const flags = Object.fromEntries(Object.entries(TOGGLES).map(([id, prop]) => [prop, !off.includes(id)])) as Record<
    (typeof TOGGLES)[string],
    boolean
  >
  const setOff = (list: string[]) => setManual({ step, off: list })
  const toggle = (id: string) => setOff(off.includes(id) ? off.filter((x) => x !== id) : [...off, id])

  const steps: StepDef[] = [
    ...c4Levels
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
      })),
    {
      id: 'sloppy',
      title: 'Sloppy diagram',
      render: () => (
        <div className="level-card">
          <p className="level-question">Same C2, five checks switched off. What can the room still tell?</p>
          <p className="small muted">No title, no legend, no technology, no descriptions, and lines without intent. The boxes are still there; the meaning is gone.</p>
        </div>
      ),
    },
    {
      id: 'fixed',
      title: 'Fixed',
      render: () => (
        <div className="level-card">
          <p className="level-question">Every check back on. Which one changed the most?</p>
          <p className="small muted">Usually the labelled lines: a box tells you what exists, a labelled line tells you what happens.</p>
        </div>
      ),
    },
  ]

  return (
    <PageShell page={page}>
      <div className="stage-split">
        <DiagramRenderer key={level.id} spec={level.spec} maxHeight="var(--stage-diagram-max)" {...flags} />
        <div className="c4-controls">
          <Stepper steps={steps} active={step} onChange={setStep} compact />
          <section className="stack-sm">
            <div className="row-between">
              <p className="eyebrow">Notation checklist (c4model.com)</p>
              <span className="btn-group">
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => setOff(ALL_OFF)}>
                  Sloppy
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
                    <label title={toggleable ? 'Switch off to see what the diagram loses' : check.why}>
                      <input type="checkbox" checked={!isOff} disabled={!toggleable} onChange={() => toggle(check.id)} />
                      <span className="notation-label">{check.label}</span>
                      {isOff ? <span className="notation-why">{check.why}</span> : null}
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
            </div>
          </details>
        </div>
      </div>
    </PageShell>
  )
}
