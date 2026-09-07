import type { PageProps } from '../app/pageComponents'
import { site } from '../content/site'
import { talkAgenda } from '../content/playbook'
import { PageShell } from '../components/shell/PageShell'
import { AgendaStrip } from '../components/widgets/AgendaStrip'
import { QrCode } from '../components/widgets/QrCode'

export default function TitlePage({ page }: PageProps) {
  return (
    <PageShell page={page} heroAside={<QrCode caption="Open the deck on your phone" />}>
      <div className="stack-lg">
        <section className="stack-sm">
          <p className="eyebrow">Run of show · {site.sessionMinutes} minutes</p>
          <AgendaStrip items={talkAgenda} total={site.sessionMinutes} />
        </section>
        <section className="grid-3">
          <div className="card card-sm stack-sm">
            <p className="eyebrow">Navigate</p>
            <p>
              Arrow keys or the footer buttons. <kbd>T</kbd> opens the contents, <kbd>?</kbd> shows every key.
            </p>
          </div>
          <div className="card card-sm stack-sm">
            <p className="eyebrow">Deep dives</p>
            <p>
              Nine architecture styles and ten katas hang off the main track. Press <kbd>↓</kbd> wherever the footer says
              “Deep dive”.
            </p>
          </div>
          <div className="card card-sm stack-sm">
            <p className="eyebrow">Live round</p>
            <p>Groups of three to five, paper and markers, fifteen minutes on the clock. The timer lives in the footer.</p>
          </div>
        </section>
      </div>
    </PageShell>
  )
}
