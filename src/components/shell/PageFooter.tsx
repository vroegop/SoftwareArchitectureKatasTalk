import { Link } from 'react-router-dom'
import { SECTION_LABELS, type PageDef } from '../../content/types'
import { mainTrack, neighbours, positionLabel, talkNext, talkPrev } from '../../app/registry'
import { useStore } from '../../app/stores/createStore'
import { settingsStore, toggleNotes } from '../../app/stores/settingsStore'
import { ui } from '../../app/stores/uiStore'
import { TimerPill } from '../overlays/TimerPill'

export function PageFooter({ page }: { page?: PageDef }) {
  const settings = useStore(settingsStore)
  const n = page ? neighbours(page.id) : {}
  const prev = page ? talkPrev(page.id) : undefined
  const next = page ? talkNext(page.id) : undefined
  return (
    <footer className="app-footer">
      <div className="footer-left">
        {page ? (
          <>
            <span className="footer-pos mono">
              {positionLabel(page.id)} / {mainTrack.length}
            </span>
            <span className="footer-section">{SECTION_LABELS[page.section]}</span>
            {page.minute !== undefined ? <span className="footer-minute muted">min {page.minute}</span> : null}
          </>
        ) : null}
      </div>
      <nav className="footer-nav" aria-label="Page navigation">
        {n.up ? (
          <Link className="btn btn-sm btn-ghost" to={n.up.path} title="Back up (Esc)">
            ↑ {n.up.title}
          </Link>
        ) : null}
        {prev ? (
          <Link className="btn btn-sm" to={prev.path} title="Previous page (Shift + ←)" aria-label={`Previous: ${prev.title}`}>
            ←
          </Link>
        ) : (
          <span className="btn btn-sm" aria-hidden="true" style={{ visibility: 'hidden' }}>
            ←
          </span>
        )}
        {next ? (
          <Link className="btn btn-sm" to={next.path} title="Next page (Shift + →)" aria-label={`Next: ${next.title}`}>
            →
          </Link>
        ) : (
          <span className="btn btn-sm" aria-hidden="true" style={{ visibility: 'hidden' }}>
            →
          </span>
        )}
        {n.down ? (
          <Link className="btn btn-sm btn-ghost" to={n.down.path} title="Deep dive (↓)">
            ↓ Deep dive
          </Link>
        ) : null}
      </nav>
      <div className="footer-right">
        <TimerPill />
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          aria-pressed={settings.notes}
          onClick={toggleNotes}
          title="Speaker notes (N)"
        >
          Notes
        </button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => ui.openOverlay('toc')} title="Contents (T)">
          Contents
        </button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => ui.openOverlay('help')} title="Help (?)">
          ?
        </button>
      </div>
    </footer>
  )
}
