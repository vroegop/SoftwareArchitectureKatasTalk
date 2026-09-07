import { Link } from 'react-router-dom'
import type { PageProps } from '../app/pageComponents'
import { useLive } from '../app/stores/liveStore'
import { kataById } from '../content/katas'
import { checklists, customerReminders } from '../content/live'
import { timerPresetById } from '../content/timers'
import { PageShell } from '../components/shell/PageShell'
import { BigTimer } from '../components/widgets/BigTimer'
import { Checklist } from '../components/widgets/Checklist'
import { KataCard } from '../components/widgets/KataCard'

export default function LiveC1Page({ page }: PageProps) {
  const state = useLive()
  const kata = state.kataId ? kataById[state.kataId] : undefined
  const list = checklists.find((c) => c.id === 'c1') ?? checklists[0]
  return (
    <PageShell page={page} heroAside={<BigTimer preset={timerPresetById[page.timerPreset ?? 'c1-round']} label={kata ? `C1 · ${kata.title}` : undefined} />}>
      <div className="live-grid">
        <Checklist list={list} big />
        <section className="stack">
          {kata ? (
            <KataCard kata={kata} compact />
          ) : (
            <div className="card card-sm stack-sm">
              <p className="muted">No kata picked yet.</p>
              <Link className="btn btn-sm btn-primary" to="/library">
                Pick a kata →
              </Link>
            </div>
          )}
          <div className="stack-sm">
            <p className="eyebrow">Ask the customer</p>
            <ul className="bullets">
              {customerReminders.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </PageShell>
  )
}
