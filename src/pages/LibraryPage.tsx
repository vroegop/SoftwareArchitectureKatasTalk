import { Link } from 'react-router-dom'
import type { PageProps } from '../app/pageComponents'
import { live, useLive } from '../app/stores/liveStore'
import { useSearchParamState } from '../app/useSearchParamState'
import { kataById, katas } from '../content/katas'
import { PageShell } from '../components/shell/PageShell'
import { KataPicker } from '../components/widgets/KataPicker'

const allTags = Array.from(new Set(katas.flatMap((k) => k.tags))).sort()

export default function LibraryPage({ page }: PageProps) {
  const state = useLive()
  const [tag, setTag] = useSearchParamState('tag', '')
  const visible = tag ? katas.filter((k) => k.tags.includes(tag)) : katas
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
          <div className="row" data-keys="local">
            <span className="small muted">Filter</span>
            <button type="button" className="pick-chip" aria-pressed={tag === ''} onClick={() => setTag(null)}>
              all
            </button>
            {allTags.map((t) => (
              <button key={t} type="button" className="pick-chip" aria-pressed={tag === t} onClick={() => setTag(tag === t ? null : t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="grid-auto">
          {visible.map((kata) => {
            const isPicked = picked?.id === kata.id
            const used = state.usedKataIds.includes(kata.id)
            return (
              <article key={kata.id} className={`card card-sm stack-sm${isPicked ? ' is-selected' : ''}`}>
                <div className="row-between">
                  <span className="chip">{kata.difficulty}</span>
                  {used && !isPicked ? <span className="chip muted">used</span> : null}
                </div>
                <h3 className="card-title">{kata.title}</h3>
                <p className="small">{kata.summary}</p>
                <div className="row">
                  {kata.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="btn-group">
                  <Link className="btn btn-sm" to={`/library/${kata.id}`}>
                    Read
                  </Link>
                  <button type="button" className="btn btn-sm btn-primary" aria-pressed={isPicked} onClick={() => live.pickKata(kata.id)}>
                    {isPicked ? 'Picked' : 'Use this kata'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
        <p className="small muted">
          Katas by Ted Neward and Neal Ford, lightly paraphrased; each card links to the original. Press <kbd>↓</kbd> to read them one by one.
        </p>
      </div>
    </PageShell>
  )
}
