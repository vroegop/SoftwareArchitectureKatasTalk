import type { PageProps } from '../app/pageComponents'
import { useLive } from '../app/stores/liveStore'
import { kataById } from '../content/katas'
import { checklists } from '../content/live'
import { timerPresetById } from '../content/timers'
import { PageShell } from '../components/shell/PageShell'
import { BigTimer } from '../components/widgets/BigTimer'
import { Checklist } from '../components/widgets/Checklist'

export default function LiveC2Page({ page }: PageProps) {
  const state = useLive()
  const kata = state.kataId ? kataById[state.kataId] : undefined
  const c2 = checklists.find((c) => c.id === 'c2') ?? checklists[0]
  const c3 = checklists.find((c) => c.id === 'c3')
  return (
    <PageShell page={page} heroAside={<BigTimer preset={timerPresetById[page.timerPreset ?? 'c2-round']} label={kata ? `C2 · ${kata.title}` : undefined} />}>
      <div className="live-grid">
        <Checklist list={c2} big />
        <section className="stack">
          {kata ? (
            <div className="card card-sm stack-sm">
              <p className="eyebrow">Kata of the round</p>
              <p className="card-title">{kata.title}</p>
              <p className="small muted">Zoom into the system box of your C1: every container needs a technology and a reason to exist.</p>
            </div>
          ) : null}
          {c3 ? <Checklist list={c3} /> : null}
          <p className="small muted">Only if there is time: a group that finishes C2 early splits in two and each half draws a C3 of one container.</p>
        </section>
      </div>
    </PageShell>
  )
}
