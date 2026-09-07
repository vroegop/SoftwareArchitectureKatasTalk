import { useState } from 'react'
import type { PageProps } from '../app/pageComponents'
import { useAtEnd, useStepIndex } from '../app/stepParams'
import { useStepHandler } from '../app/steps'
import { customerQuestions, westhavenKata } from '../content/example'
import { PageShell } from '../components/shell/PageShell'
import { KataCard } from '../components/widgets/KataCard'
import { SegmentedControl } from '../components/widgets/SegmentedControl'

const total = customerQuestions.length
const VIEWS = [
  { id: '0', label: 'The kata' },
  { id: '1', label: 'Ask the customer' },
]

/**
 * First the kata card, full width; then the customer questions, revealed one
 * at a time. Only the latest revealed answer stays expanded, so the list never
 * outgrows the stage; earlier answers keep a check mark and re-open on click.
 */
export default function CasePage({ page }: PageProps) {
  const atEnd = useAtEnd()
  const [view, setView] = useStepIndex('view', 2)
  const [revealed, setRevealed] = useState(atEnd ? total : 0)
  const [expanded, setExpanded] = useState<number | null>(atEnd ? total - 1 : null)

  useStepHandler(
    () => {
      if (view === 0) {
        setView(1)
        return true
      }
      if (revealed >= total) return false
      setRevealed(revealed + 1)
      setExpanded(revealed)
      return true
    },
    () => {
      if (view === 0) return false
      if (revealed <= 0) {
        setView(0)
        return true
      }
      setRevealed(revealed - 1)
      setExpanded(revealed - 2 >= 0 ? revealed - 2 : null)
      return true
    },
  )

  function toggle(i: number): void {
    if (i >= revealed) {
      setRevealed(i + 1)
      setExpanded(i)
      return
    }
    setExpanded(expanded === i ? null : i)
  }

  return (
    <PageShell page={page}>
      <div className="stack">
        <div className="row-between">
          <SegmentedControl options={VIEWS} value={String(view)} onChange={(id) => setView(Number(id))} ariaLabel="View" />
          {view === 1 ? (
            <span className="btn-group">
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  setRevealed(total)
                  setExpanded(total - 1)
                }}
              >
                Reveal all
              </button>
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  setRevealed(0)
                  setExpanded(null)
                }}
              >
                Hide all
              </button>
            </span>
          ) : (
            <span className="small muted">Forward opens the questions groups ask the customer.</span>
          )}
        </div>
        {view === 0 ? (
          <KataCard kata={westhavenKata} compact />
        ) : (
          <section className="stack-sm qa-view fade-in">
            <p className="muted small">Click a question, or press forward to reveal the next answer. Answering these is the facilitator’s job in the room.</p>
            <ol className="qa qa-columns">
              {customerQuestions.map((item, i) => {
                const isRevealed = i < revealed
                const isOpen = expanded === i
                return (
                  <li key={item.q} className={`qa-item${isOpen ? ' is-open' : ''}${isRevealed ? ' is-revealed' : ''}`}>
                    <button type="button" className="qa-question" onClick={() => toggle(i)} aria-expanded={isOpen}>
                      <span>{item.q}</span>
                      <span aria-hidden="true">{isOpen ? '−' : isRevealed ? '✓' : '+'}</span>
                    </button>
                    {isOpen ? <p className="qa-answer fade-in">{item.a}</p> : null}
                  </li>
                )
              })}
            </ol>
          </section>
        )}
      </div>
    </PageShell>
  )
}
