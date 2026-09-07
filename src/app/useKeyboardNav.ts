import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PageDef } from '../content/types'
import { isButtonLike, isEditableTarget, isLocalKeysTarget } from './keyboard'
import { mainTrack, neighbours, pageForPath } from './registry'
import { stepNext, stepPrev } from './steps'
import { cycleTheme, toggleNotes } from './stores/settingsStore'
import { ui, uiStore } from './stores/uiStore'

export function toggleFullscreen(): void {
  if (typeof document === 'undefined') return
  if (document.fullscreenElement) {
    void document.exitFullscreen()
  } else {
    void document.documentElement.requestFullscreen?.()
  }
}

/** One global keydown listener implementing the presenter key map. */
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

/** Current page read from the URL at keydown time, so rapid key presses never see a stale page. */
function currentPage(): PageDef | undefined {
  const pathname = window.location.pathname
  const relative = basename && pathname.startsWith(basename) ? pathname.slice(basename.length) : pathname
  return pageForPath(relative || '/')
}

export function useKeyboardNav(): void {
  const navigate = useNavigate()

  useEffect(() => {
    function onKey(e: KeyboardEvent): void {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.repeat && e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return

      const { overlay, blank } = uiStore.get()
      if (blank) {
        ui.setBlank(false)
        e.preventDefault()
        return
      }
      if (overlay) {
        // Native <dialog> handles Escape and owns the keys while it is open. If the
        // dialog already closed itself, catch the store up instead of eating the key.
        if (document.querySelector('dialog[open]')) return
        ui.closeOverlay()
      }
      if (isEditableTarget(e.target) && e.key !== 'Escape') return
      if (isLocalKeysTarget(e.target) && e.key !== 'Escape') return

      const page = currentPage()
      if (!page) return
      const n = neighbours(page.id)
      const go = (target?: PageDef): void => {
        if (!target) return
        navigate(target.path)
        e.preventDefault()
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          go(n.next)
          break
        case 'ArrowLeft':
        case 'PageUp':
          go(n.prev)
          break
        case ' ':
          if (isButtonLike(e.target)) return
          if (e.shiftKey ? stepPrev() : stepNext()) {
            e.preventDefault()
            break
          }
          go(e.shiftKey ? n.prev : n.next)
          break
        case 'ArrowDown':
          go(n.down)
          break
        case 'ArrowUp':
          go(n.up)
          break
        case 'Escape':
          go(n.up)
          break
        case 'Home':
          go(mainTrack[0])
          break
        case 'End':
          go(mainTrack[mainTrack.length - 1])
          break
        case 't':
        case 'T':
          ui.toggleOverlay('toc')
          break
        case 'n':
        case 'N':
          toggleNotes()
          break
        case 'c':
        case 'C':
          ui.toggleOverlay('timer')
          break
        case 'h':
        case 'H':
          ui.toggleHero()
          break
        case 'd':
        case 'D':
          cycleTheme()
          break
        case 'f':
        case 'F':
          toggleFullscreen()
          break
        case 'b':
        case 'B':
          ui.toggleBlank()
          break
        case '?':
          ui.toggleOverlay('help')
          break
        default:
          return
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])
}
