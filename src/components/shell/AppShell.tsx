import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { site } from '../../content/site'
import { useCurrentPage } from '../../app/useCurrentPage'
import { useKeyboardNav } from '../../app/useKeyboardNav'
import { useStore } from '../../app/stores/createStore'
import { settingsStore } from '../../app/stores/settingsStore'
import { ui, useUi } from '../../app/stores/uiStore'
import { HelpOverlay } from '../overlays/HelpOverlay'
import { SpeakerNotes } from '../overlays/SpeakerNotes'
import { TimerAlarm } from '../overlays/TimerAlarm'
import { TimerOverlay } from '../overlays/TimerOverlay'
import { TocOverlay } from '../overlays/TocOverlay'
import { PageFooter } from './PageFooter'
import { ProgressBar } from './ProgressBar'

export function AppShell() {
  useKeyboardNav()
  const location = useLocation()
  const page = useCurrentPage()
  const { blank, overlay } = useUi()
  const settings = useStore(settingsStore)

  useEffect(() => {
    ui.setHeroCollapsed(false)
    ui.closeOverlay()
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  useEffect(() => {
    document.title = page ? `${page.title} · ${site.title}` : site.title
  }, [page])

  return (
    <div className={`app${settings.notes ? ' has-notes' : ''}`}>
      <ProgressBar page={page} />
      <div className="app-body">
        <main className="app-main" id="main">
          <Outlet />
        </main>
        {settings.notes && page ? <SpeakerNotes page={page} /> : null}
      </div>
      <PageFooter page={page} />
      <TocOverlay open={overlay === 'toc'} />
      <TimerOverlay open={overlay === 'timer'} />
      <HelpOverlay open={overlay === 'help'} />
      <TimerAlarm />
      {blank ? (
        <button
          type="button"
          className="blank-screen"
          aria-label="Screen blanked. Press any key or tap to return."
          onClick={() => ui.setBlank(false)}
        />
      ) : null}
    </div>
  )
}
