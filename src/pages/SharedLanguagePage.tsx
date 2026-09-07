import type { PageProps } from '../app/pageComponents'
import { useCycleSteps } from '../app/steps'
import { useStepId } from '../app/stepParams'
import { conversations, vocabulary } from '../content/shared-language'
import { PageShell } from '../components/shell/PageShell'
import { SegmentedControl } from '../components/widgets/SegmentedControl'

function humanMinutes(minutes: number): string {
  if (minutes >= 60 * 24) return `${Math.round(minutes / (60 * 24))} days`
  if (minutes >= 60) return `${Math.round(minutes / 60)} hours`
  return `${minutes} minutes`
}

const VARIANT_IDS: string[] = conversations.map((c) => c.id)

export default function SharedLanguagePage({ page }: PageProps) {
  const [variantId, setVariant] = useStepId('variant', VARIANT_IDS)
  const index = Math.max(0, VARIANT_IDS.indexOf(variantId))
  const variant = conversations[index]
  useCycleSteps(index, conversations.length, (i) => setVariant(conversations[i].id))

  return (
    <PageShell page={page}>
      <div className="stage-split">
        <section className="stack">
          <SegmentedControl
            options={conversations.map((c) => ({ id: c.id, label: c.title }))}
            value={variant.id}
            onChange={setVariant}
            ariaLabel="Conversation variant"
            size="lg"
          />
          <div className="card fade-in stack" key={variant.id}>
            <p className="eyebrow">Adding “notify the customer when the order ships”</p>
            <ol className="conversation">
              {variant.lines.map((line, i) => (
                <li key={`${line.who}-${i}`}>
                  <span className={`who${line.who.toLowerCase().includes('you') ? ' is-you' : ''}`}>{line.who}</span>
                  <span>{line.text}</span>
                </li>
              ))}
            </ol>
            <div className="outcome">
              <span className={`outcome-time ${variant.id === 'after' ? 'accent' : 'muted'}`}>{humanMinutes(variant.minutesToDecision)}</span>
              <span>to a decision. {variant.outcome}</span>
            </div>
          </div>
        </section>
        <section className="stack">
          <p className="eyebrow">The vocabulary that did the work</p>
          <dl className="vocab">
            {vocabulary.map((v) => (
              <div key={v.term}>
                <dt>{v.term}</dt>
                <dd>{v.meaning}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </PageShell>
  )
}
