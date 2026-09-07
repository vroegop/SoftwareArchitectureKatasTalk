import { Link } from 'react-router-dom'
import type { PageProps } from '../app/pageComponents'
import { live, useLive } from '../app/stores/liveStore'
import { kataById } from '../content/katas'
import { PageShell } from '../components/shell/PageShell'
import { KataCard } from '../components/widgets/KataCard'

export default function KataPage({ page }: PageProps) {
  const state = useLive()
  const kata = kataById[page.param ?? '']
  if (!kata) return <PageShell page={page}>Unknown kata.</PageShell>
  const isPicked = state.kataId === kata.id
  return (
    <PageShell page={page}>
      <div>
        <KataCard
          kata={kata}
          compact
          showHints
          actions={
            <div className="btn-group">
              <button type="button" className="btn btn-primary" aria-pressed={isPicked} onClick={() => live.pickKata(kata.id)}>
                {isPicked ? 'Kata of the round' : 'Use this kata'}
              </button>
              {isPicked ? (
                <Link className="btn" to="/live/c1">
                  Start round 1 →
                </Link>
              ) : null}
            </div>
          }
        />
      </div>
    </PageShell>
  )
}
