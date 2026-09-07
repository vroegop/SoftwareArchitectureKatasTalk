import type { PageProps } from '../app/pageComponents'
import { westhavenC2, westhavenSeedRisks } from '../content/example'
import { testOnPaperSiblings } from '../content/playbook'
import { PageShell } from '../components/shell/PageShell'
import { RiskStormBoard } from '../components/widgets/RiskStormBoard'

const STEPS = [
  { title: 'Draw the diagrams', detail: 'C1 and C2 of what you plan to build or change, on the wall.' },
  { title: 'Identify risks in silence', detail: 'Ten minutes, everyone alone, one risk per sticky with probability and impact.' },
  { title: 'Converge on the diagram', detail: 'Stick every note on the element it belongs to; clusters show themselves.' },
  { title: 'Review and act', detail: 'Discuss the outliers and disagreements, then write actions for the high ones.' },
]

export default function RiskStormingPage({ page }: PageProps) {
  return (
    <PageShell page={page}>
      <div className="stack">
        <ol className="risk-steps">
          {STEPS.map((step, i) => (
            <li key={step.title} className="risk-step">
              <span className="risk-step-num">{i + 1}</span>
              <strong>{step.title}</strong>
              <span className="small muted">{step.detail}</span>
            </li>
          ))}
        </ol>
        <div className="score-legend small">
          <span className="eyebrow">Score = probability × impact</span>
          <span className="chip risk-chip-low">1–2 low</span>
          <span className="chip risk-chip-medium">3–4 medium</span>
          <span className="chip risk-chip-high">6–9 high</span>
          <span className="muted">Technique by Simon Brown, riskstorming.com. Stickies stay in this browser only.</span>
        </div>
        <RiskStormBoard spec={westhavenC2} seeds={westhavenSeedRisks} />
        <details className="small">
          <summary className="muted">Other ways to test an architecture on paper</summary>
          <ul className="bullets" style={{ marginTop: 8 }}>
            {testOnPaperSiblings.map((s) => (
              <li key={s.name}>
                <strong>{s.name}.</strong> {s.oneLiner}
                {s.url ? (
                  <>
                    {' '}
                    <a href={s.url} target="_blank" rel="noreferrer">
                      more
                    </a>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </PageShell>
  )
}
