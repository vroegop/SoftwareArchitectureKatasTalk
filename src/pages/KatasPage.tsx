import type { PageProps } from '../app/pageComponents'
import { useStepId, useStepIndex } from '../app/stepParams'
import { kataById } from '../content/katas'
import { kataAnatomy, kataRules, kataTimeline, notAKata } from '../content/katas-intro'
import { PageShell } from '../components/shell/PageShell'
import { Stepper } from '../components/widgets/Stepper'
import { Tabs } from '../components/widgets/Tabs'

const sample = kataById['hot-diggety-dog']

function Anatomy() {
  const [step, setStep] = useStepIndex('step', kataAnatomy.length)
  const active = kataAnatomy[Math.min(step, kataAnatomy.length - 1)]
  const cls = (id: string) => (active.id === id ? 'is-active' : 'is-inactive')
  return (
    <div className="stage-split">
      <article className="kata-card kata-anatomy">
        <header className="kata-head">
          <div>
            <p className="eyebrow">A real kata · {sample.difficulty}</p>
            <h3 className="kata-title">{sample.title}</h3>
          </div>
        </header>
        <p className={`kata-summary ${cls('description')}`}>{sample.summary}</p>
        <dl className="kata-body">
          <div className={cls('users')}>
            <dt>Users</dt>
            <dd>{sample.users}</dd>
          </div>
          <div className={cls('requirements')}>
            <dt>Requirements</dt>
            <dd>
              <ul className="bullets">
                {sample.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div className={cls('context')}>
            <dt>Additional context</dt>
            <dd>
              <ul className="bullets">
                {sample.additionalContext.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </article>
      <Stepper
        steps={kataAnatomy.map((part) => ({
          id: part.id,
          title: part.title,
          render: () => (
            <div className="stack-sm">
              <p>{part.why}</p>
              <p className="eyebrow">Ask about it</p>
              <ul className="bullets">
                {part.questionsToAsk.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </div>
          ),
        }))}
        active={step}
        onChange={setStep}
      />
    </div>
  )
}

const TAB_IDS = ['anatomy', 'rules', 'origins'] as const

export default function KatasPage({ page }: PageProps) {
  const [tab, setTab] = useStepId('tab', TAB_IDS)
  return (
    <PageShell page={page}>
      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: 'anatomy', label: 'Anatomy of a kata', render: () => <Anatomy /> },
          {
            id: 'rules',
            label: 'The rules',
            render: () => (
              <div className="grid-3">
                {kataRules.map((rule, i) => (
                  <div key={rule.title} className="card card-sm stack-sm">
                    <p className="eyebrow">Rule {i + 1}</p>
                    <p className="card-title">{rule.title}</p>
                    <p className="muted">{rule.detail}</p>
                  </div>
                ))}
              </div>
            ),
          },
          {
            id: 'origins',
            label: 'Origins',
            render: () => (
              <div className="stage-split-even stage-split">
                <section className="stack-sm">
                  <p className="eyebrow">Where katas come from</p>
                  <ol className="timeline">
                    {kataTimeline.map((t) => (
                      <li key={t.year + t.text}>
                        <span className="year">{t.year}</span>
                        <span>{t.text}</span>
                      </li>
                    ))}
                  </ol>
                </section>
                <section className="stack-sm">
                  <p className="eyebrow">What a kata is not</p>
                  <ul className="bullets">
                    {notAKata.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </section>
              </div>
            ),
          },
        ]}
      />
    </PageShell>
  )
}
