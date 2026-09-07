import { useState } from 'react'
import type { PageProps } from '../app/pageComponents'
import { useStepHandler } from '../app/steps'
import { customerQuestions, westhavenKata } from '../content/example'
import { PageShell } from '../components/shell/PageShell'
import { KataCard } from '../components/widgets/KataCard'

export default function CasePage({ page }: PageProps) {
  const [open, setOpen] = useState<number[]>([])
  useStepHandler(
    () => {
      const next = customerQuestions.findIndex((_, i) => !open.includes(i))
      if (next === -1) return false
      setOpen([...open, next])
      return true
    },
    () => {
      if (open.length === 0) return false
      setOpen(open.slice(0, -1))
      return true
    },
  )
  const toggle = (i: number) => setOpen(open.includes(i) ? open.filter((x) => x !== i) : [...open, i])

  return (
    <PageShell page={page}>
      <div className="stage-split">
        <KataCard kata={westhavenKata} compact />
        <section className="stack-sm">
          <div className="row-between">
            <p className="eyebrow">Ask the customer</p>
            <span className="btn-group">
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => setOpen(customerQuestions.map((_, i) => i))}>
                Reveal all
              </button>
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => setOpen([])}>
                Hide all
              </button>
            </span>
          </div>
          <p className="muted small">Click a question, or press Space to reveal the next answer. This is the facilitator’s job in the room.</p>
          <ol className="qa">
            {customerQuestions.map((item, i) => {
              const isOpen = open.includes(i)
              return (
                <li key={item.q} className={`qa-item${isOpen ? ' is-open' : ''}`}>
                  <button type="button" className="qa-question" onClick={() => toggle(i)} aria-expanded={isOpen}>
                    <span>{item.q}</span>
                    <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen ? <p className="qa-answer fade-in">{item.a}</p> : null}
                </li>
              )
            })}
          </ol>
        </section>
      </div>
    </PageShell>
  )
}
