import { useLayoutEffect, useRef, type ReactNode } from 'react'
import type { PageDef } from '../../content/types'
import { ui, useUi } from '../../app/stores/uiStore'
import { Hero } from './Hero'

export interface PageShellProps {
  page: PageDef
  /** Rendered at the right of the hero: a QR code, a timer, a kata card. */
  heroAside?: ReactNode
  children: ReactNode
}

/** A tolerance in pixels below which a stage counts as fitting. */
const SLACK = 4

export function PageShell({ page, heroAside, children }: PageShellProps) {
  const { heroCollapsed, stageOverflow } = useUi()
  const stageRef = useRef<HTMLElement>(null)

  // Every page starts with its hero expanded and measures whether the stage
  // fits underneath; the forward key collapses the hero when it does not.
  // Arriving in the final state (`?at=end`) collapses straight away if needed.
  useLayoutEffect(() => {
    ui.setHeroCollapsed(false)
    ui.setStageOverflow(false)
    const stage = stageRef.current
    if (!stage) return
    const atEnd = new URLSearchParams(window.location.search).get('at') === 'end'
    let first = true
    const measure = (): void => {
      const overflow = stage.scrollHeight > stage.clientHeight + SLACK
      ui.setStageOverflow(overflow)
      if (first) {
        first = false
        if (atEnd && overflow) ui.setHeroCollapsed(true)
      }
    }
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    if (stage.firstElementChild) observer.observe(stage.firstElementChild)
    measure()
    return () => observer.disconnect()
  }, [page.id])

  return (
    <article className={`page${heroCollapsed ? ' hero-collapsed' : ''}`} data-page={page.id}>
      <Hero hero={page.hero} aside={heroAside} collapsed={heroCollapsed} needsRoom={stageOverflow && !heroCollapsed} onToggle={ui.toggleHero} />
      <section className="stage" ref={stageRef}>
        <div className="stage-inner">{children}</div>
      </section>
    </article>
  )
}
