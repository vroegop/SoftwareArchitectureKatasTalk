import { useState } from 'react'
import type { PageProps } from '../app/pageComponents'
import { useStepIndex } from '../app/stepParams'
import { useStepHandler } from '../app/steps'
import { playbookSections, sessionVariants } from '../content/playbook'
import { PageShell } from '../components/shell/PageShell'
import { SegmentedControl } from '../components/widgets/SegmentedControl'

export default function PlaybookPage({ page }: PageProps) {
  const [active, setActive] = useStepIndex('section', playbookSections.length)
  const [variantIndex, setVariantIndex] = useState(1)
  const [copied, setCopied] = useState<string | null>(null)
  const variant = sessionVariants[Math.min(variantIndex, sessionVariants.length - 1)]

  useStepHandler(
    () => {
      if (active >= playbookSections.length - 1) return false
      setActive(active + 1)
      return true
    },
    () => {
      if (active <= 0) return false
      setActive(active - 1)
      return true
    },
  )

  function copyAgenda(): void {
    void navigator.clipboard?.writeText(`${variant.title}\n${variant.agenda.join('\n')}`)
    setCopied(variant.title)
    window.setTimeout(() => setCopied(null), 1500)
  }

  return (
    <PageShell page={page}>
      <div className="stage-split">
        <section className="accordion" aria-label="Playbook">
          {playbookSections.map((section, i) => {
            const open = i === active
            return (
              <div key={section.id} className={`accordion-item${open ? ' is-open' : ''}`}>
                <button type="button" className="accordion-head" aria-expanded={open} onClick={() => setActive(i)}>
                  <span className="accordion-num mono">{i + 1}</span>
                  <span>{section.title}</span>
                  <span className="accordion-count muted small">{section.items.length} items</span>
                </button>
                {open ? (
                  <div className="accordion-body fade-in">
                    <ul className="bullets">
                      {section.items.map((item) => (
                        <li key={item.label}>
                          {item.label}
                          {item.detail ? <span className="detail">{item.detail}</span> : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            )
          })}
        </section>
        <section className="stack">
          <div className="row-between">
            <p className="eyebrow">Three formats that work</p>
            <SegmentedControl
              options={sessionVariants.map((v, i) => ({ id: String(i), label: v.title }))}
              value={String(variantIndex)}
              onChange={(id) => setVariantIndex(Number(id))}
              ariaLabel="Session format"
            />
          </div>
          <div className="card card-sm stack-sm fade-in" key={variant.title}>
            <div className="row-between">
              <span className="card-title">{variant.title}</span>
              <span className="chip">{variant.duration}</span>
            </div>
            <p className="small">{variant.description}</p>
            <ol className="variant-agenda">
              {variant.agenda.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ol>
            <button type="button" className="btn btn-sm btn-ghost" onClick={copyAgenda}>
              {copied === variant.title ? 'Copied' : 'Copy agenda'}
            </button>
          </div>
        </section>
      </div>
    </PageShell>
  )
}
