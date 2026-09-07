import type { ReactNode } from 'react'
import type { PageDef } from '../../content/types'
import { ui, useUi } from '../../app/stores/uiStore'
import { Hero } from './Hero'

export interface PageShellProps {
  page: PageDef
  /** Rendered at the right of the hero: a QR code, a timer, a kata card. */
  heroAside?: ReactNode
  children: ReactNode
}

export function PageShell({ page, heroAside, children }: PageShellProps) {
  const { heroCollapsed } = useUi()
  return (
    <article className={`page${heroCollapsed ? ' hero-collapsed' : ''}`} data-page={page.id}>
      <Hero hero={page.hero} aside={heroAside} collapsed={heroCollapsed} onToggle={ui.toggleHero} />
      <section className="stage">{children}</section>
    </article>
  )
}
