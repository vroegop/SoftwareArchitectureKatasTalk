import { useState } from 'react'
import type { PageProps } from '../app/pageComponents'
import { useCycleSteps } from '../app/steps'
import { useSearchParamState } from '../app/useSearchParamState'
import { architectThinking, laws, tradeoffSliders } from '../content/laws'
import { PageShell } from '../components/shell/PageShell'
import { SegmentedControl } from '../components/widgets/SegmentedControl'

export default function LawsPage({ page }: PageProps) {
  const [sliderId, setSliderId] = useSearchParamState('slider', tradeoffSliders[0].id)
  const index = Math.max(
    0,
    tradeoffSliders.findIndex((s) => s.id === sliderId),
  )
  const slider = tradeoffSliders[index]
  const [positions, setPositions] = useState<Record<string, number>>({})
  const value = positions[slider.id] ?? 50
  useCycleSteps(index, tradeoffSliders.length, (i) => setSliderId(tradeoffSliders[i].id))
  const leaning = value < 40 ? 'left' : value > 60 ? 'right' : 'middle'

  return (
    <PageShell page={page}>
      <div className="stack-lg">
        <section className="law-cards">
          {laws.map((law) => (
            <div key={law.number} className="card card-sm stack-sm">
              <span className="law-number">{law.number}</span>
              <p className="law-text">{law.text}</p>
              <p className="small muted">{law.explanation}</p>
              <span className="chip">{law.edition}</span>
            </div>
          ))}
        </section>
        <section className="slider-box" data-keys="local">
          <div className="row-between">
            <p className="eyebrow">Every decision sits on a spectrum. Move the slider.</p>
            <SegmentedControl
              options={tradeoffSliders.map((s) => ({ id: s.id, label: `${s.left} ↔ ${s.right}` }))}
              value={slider.id}
              onChange={setSliderId}
              ariaLabel="Trade-off"
            />
          </div>
          <p className="level-question">{slider.question}</p>
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(e) => setPositions({ ...positions, [slider.id]: Number(e.target.value) })}
            aria-label={`${slider.left} to ${slider.right}`}
          />
          <p className="slider-position">
            {leaning === 'left' ? `Leaning ${slider.left.toLowerCase()}` : leaning === 'right' ? `Leaning ${slider.right.toLowerCase()}` : 'Somewhere in between, which is also a decision'}
          </p>
          <div className="slider-ends">
            <div className={`slider-end${leaning === 'left' ? ' is-leaning' : ''}`}>
              <h4>{slider.left}</h4>
              <ul className="bullets">
                {slider.leftGains.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
            <div className={`slider-end slider-end-right${leaning === 'right' ? ' is-leaning' : ''}`}>
              <h4>{slider.right}</h4>
              <ul className="bullets">
                {slider.rightGains.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section className="row">
          <span className="eyebrow">Thinking like an architect</span>
          {architectThinking.map((t) => (
            <span key={t.title} className="chip" title={t.detail}>
              {t.title}
            </span>
          ))}
        </section>
      </div>
    </PageShell>
  )
}
