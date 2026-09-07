import type { PageProps } from '../app/pageComponents'
import { site } from '../content/site'
import { firstKataAgenda, takeaways } from '../content/playbook'
import { PageShell } from '../components/shell/PageShell'
import { AgendaStrip } from '../components/widgets/AgendaStrip'
import { QrCode } from '../components/widgets/QrCode'

export default function ClosingPage({ page }: PageProps) {
  return (
    <PageShell page={page} heroAside={<QrCode caption="Deck, katas and the playbook" />}>
      <div className="stack-lg">
        <section className="takeaway-cards">
          {takeaways.map((t, i) => (
            <div key={t.title} className="card card-sm stack-sm">
              <span className="takeaway-num">{i + 1}</span>
              <p className="card-title">{t.title}</p>
              <p className="muted">{t.detail}</p>
            </div>
          ))}
        </section>
        <section className="stack-sm">
          <p className="eyebrow">Your first kata next week: sixty minutes</p>
          <AgendaStrip items={firstKataAgenda} total={60} />
        </section>
        <section className="placeholder stack-sm" style={{ maxWidth: '60ch' }}>
          <p className="eyebrow">Contact</p>
          <p>
            {site.author} · {site.event}
          </p>
          <p className="muted small">[PLACEHOLDER] add your e-mail, LinkedIn or Mastodon handle in src/content/site.ts and here.</p>
        </section>
      </div>
    </PageShell>
  )
}
