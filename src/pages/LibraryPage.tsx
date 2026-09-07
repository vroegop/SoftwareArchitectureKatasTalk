import { Link } from 'react-router-dom'
import type { PageProps } from '../app/pageComponents'
import { live, useLive } from '../app/stores/liveStore'
import { kataById, katas } from '../content/katas'
import { PageShell } from '../components/shell/PageShell'
import { KataPicker } from '../components/widgets/KataPicker'

export default function LibraryPage({ page }: PageProps) {
  const state = useLive()
  const visible = katas
  const picked = state.kataId ? kataById[state.kataId] : undefined

  const aside = picked ? (
    <div className="card card-sm stack-sm is-selected">
      <p className="eyebrow">Kata of the round</p>
      <p className="card-title">{picked.title}</p>
      <div className="btn-group">
        <Link className="btn btn-sm btn-primary" to="/live/c1">
          Start round 1 →
        </Link>
        <Link className="btn btn-sm btn-ghost" to={`/library/${picked.id}`}>
          Read
        </Link>
      </div>
    </div>
  ) : undefined

  return (
    <PageShell page={page} heroAside={aside}>
      <div className="stack">
        <div className="row-between">
          <KataPicker katas={katas} usedIds={state.usedKataIds} onPick={live.pickKata} />
          <span className="small muted">Hover a row for its summary; the difficulty chip is a hint for first-timers.</span>
        </div>
        <ul className="kata-rows">
          {visible.map((kata) => {
            const isPicked = picked?.id === kata.id
            const used = state.usedKataIds.includes(kata.id)
            return (
              <li key={kata.id} className={`kata-row${isPicked ? ' is-selected' : ''}`} title={kata.summary}>
                <span className="chip">{kata.difficulty}</span>
                <span className="kata-row-main">
                  <Link className="kata-row-title" to={`/library/${kata.id}`}>
                    {kata.title}
                  </Link>
                  <span className="kata-row-summary small muted">{kata.summary.split('. ')[0].replace(/\.$/, '')}.</span>
                </span>
                <span className="row kata-row-tags">
                  {kata.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                  {used && !isPicked ? <span className="chip muted">used</span> : null}
                </span>
                <span className="btn-group">
                  <Link className="btn btn-sm" to={`/library/${kata.id}`}>
                    Read
                  </Link>
                  <button type="button" className="btn btn-sm btn-primary" aria-pressed={isPicked} onClick={() => live.pickKata(kata.id)}>
                    {isPicked ? 'Picked' : 'Use this kata'}
                  </button>
                </span>
              </li>
            )
          })}
        </ul>
        <p className="small muted">
          Katas by Ted Neward and Neal Ford, lightly paraphrased; each card links to the original. Press <kbd>↓</kbd> to read them one by one.
        </p>
      </div>
    </PageShell>
  )
}
