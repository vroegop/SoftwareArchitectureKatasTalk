import { useState } from 'react'
import type { PageProps } from '../app/pageComponents'
import { playbookSections, sessionVariants } from '../content/playbook'
import { PageShell } from '../components/shell/PageShell'

export default function PlaybookPage({ page }: PageProps) {
  const [copied, setCopied] = useState<string | null>(null)
  function copyAgenda(title: string, agenda: string[]): void {
    const text = `${title}\n${agenda.join('\n')}`
    void navigator.clipboard?.writeText(text)
    setCopied(title)
    window.setTimeout(() => setCopied(null), 1500)
  }
  return (
    <PageShell page={page}>
      <div className="stage-split">
        <section className="accordion">
          {playbookSections.map((section, i) => (
            <details key={section.id} open={i === 0}>
              <summary>{section.title}</summary>
              <div className="accordion-body">
                <ul className="bullets">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      {item.label}
                      {item.detail ? <span className="detail">{item.detail}</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </section>
        <section className="stack">
          <p className="eyebrow">Three formats that work</p>
          {sessionVariants.map((variant) => (
            <div key={variant.title} className="card card-sm stack-sm">
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
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => copyAgenda(variant.title, variant.agenda)}>
                {copied === variant.title ? 'Copied' : 'Copy agenda'}
              </button>
            </div>
          ))}
        </section>
      </div>
    </PageShell>
  )
}
