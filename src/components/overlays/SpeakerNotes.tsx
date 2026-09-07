import type { PageDef } from '../../content/types'
import { neighbours, positionLabel, mainTrack } from '../../app/registry'
import { formatClock, useTimer } from '../../app/stores/timerStore'
import { toggleNotes } from '../../app/stores/settingsStore'

export function SpeakerNotes({ page }: { page: PageDef }) {
  const n = neighbours(page.id)
  const t = useTimer()
  return (
    <aside className="notes" aria-label="Speaker notes">
      <div className="notes-head">
        <span className="eyebrow">Notes · {positionLabel(page.id)} / {mainTrack.length}</span>
        <button type="button" className="btn btn-sm btn-ghost" onClick={toggleNotes} aria-label="Hide notes (N)">
          ✕
        </button>
      </div>
      <h2 className="notes-title">{page.title}</h2>
      {page.minute !== undefined ? <p className="small muted">Planned at minute {page.minute}</p> : null}
      <ol className="notes-list">
        {page.notes.map((note) => (
          <li key={note} className={note.startsWith('[PLACEHOLDER]') ? 'is-placeholder' : undefined}>
            {note}
          </li>
        ))}
      </ol>
      <div className="notes-foot small muted">
        {t.status !== 'idle' ? (
          <p className="mono">
            Timer {formatClock(t.remaining)} {t.status}
          </p>
        ) : null}
        {n.next ? <p>Next: {n.next.title}</p> : <p>Last page.</p>}
      </div>
    </aside>
  )
}
