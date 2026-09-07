import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PageDef } from '../content/types'
import { BACK_KEYS, describeAction, describeKey, FORWARD_KEYS, isButtonLike, isEditableTarget, isLocalKeysTarget } from './keyboard'
import { mainTrack, neighbours, pageForPath, talkNext, talkPrev } from './registry'
import { stepNext, stepPrev } from './steps'
import { recordKey } from './stores/keyStore'
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

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

/** Current page read from the URL at keydown time, so rapid key presses never see a stale page. */
function currentPage(): PageDef | undefined {
  const pathname = window.location.pathname
  const relative = basename && pathname.startsWith(basename) ? pathname.slice(basename.length) : pathname
  return pageForPath(relative || '/')
}

/**
 * One global keydown listener implementing the presenter key map. A clicker
 * only has forward and back, so both are step-aware: forward first gives the
 * stage the room it needs, then advances the page's steps, then moves on.
 */
export function useKeyboardNav(): void {
  const navigate = useNavigate()

  useEffect(() => {
    function onKey(e: KeyboardEvent): void {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      recordKey(describeKey(e), describeAction(e))
      if (e.repeat && e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return

      const { overlay, blank, heroCollapsed, stageOverflow } = uiStore.get()
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
      const go = (target?: PageDef, search = ''): void => {
        if (!target) return
        navigate({ pathname: target.path, search })
        e.preventDefault()
      }

      const isBack = BACK_KEYS.has(e.key) || (e.key === ' ' && e.shiftKey)
      const isForward = !isBack && FORWARD_KEYS.has(e.key)

      if (isForward) {
        if ((e.key === ' ' || e.key === 'Enter') && isButtonLike(e.target)) return
        if (e.shiftKey && e.key === 'ArrowRight') {
          go(talkNext(page.id))
          return
        }
        e.preventDefault()
        if (!heroCollapsed && stageOverflow) {
          ui.setHeroCollapsed(true)
          return
        }
        if (stepNext()) return
        go(talkNext(page.id))
        return
      }

      if (isBack) {
        if (e.key === 'Backspace' && isButtonLike(e.target)) return
        if (e.shiftKey && e.key === 'ArrowLeft') {
          go(talkPrev(page.id))
          return
        }
        e.preventDefault()
        if (stepPrev()) return
        if (heroCollapsed) {
          ui.setHeroCollapsed(false)
          return
        }
        go(talkPrev(page.id), '?at=end')
        return
      }

      const n = neighbours(page.id)
      switch (e.key) {
        case 'ArrowDown':
          go(n.down)
          break
        case 'ArrowUp':
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
        case 'F5':
          e.preventDefault()
          toggleFullscreen()
          break
        case 'b':
        case 'B':
        case '.':
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
