import type { ReactNode } from 'react'
import type { HeroSpec } from '../../content/types'

export interface HeroProps {
  hero: HeroSpec
  aside?: ReactNode
  collapsed: boolean
  /** The stage under the hero does not fit; the toggle lights up as a hint. */
  needsRoom?: boolean
  onToggle: () => void
}

export function Hero({ hero, aside, collapsed, needsRoom = false, onToggle }: HeroProps) {
  const hasSide = Boolean((hero.bullets && hero.bullets.length > 0) || hero.quote)
  const twoColumns = Boolean(hero.subtitle) && hasSide
  return (
    <header className="hero">
      <div className="hero-copy">
        {hero.kicker ? <p className="eyebrow hero-kicker">{hero.kicker}</p> : null}
        <h1 className="hero-title">{hero.title}</h1>
        {!collapsed && (hero.subtitle || hasSide) ? (
          <div className={`hero-detail${twoColumns ? ' hero-detail-2' : ''}`}>
            {hero.subtitle ? <p className="hero-subtitle">{hero.subtitle}</p> : null}
            {hasSide ? (
              <div className="hero-side">
                {hero.bullets && hero.bullets.length > 0 ? (
                  <ul className="hero-bullets">
                    {hero.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}
                {hero.quote ? (
                  <blockquote className="hero-quote">
                    <p>“{hero.quote.text}”</p>
                    <cite>{hero.quote.by}</cite>
                  </blockquote>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      {aside ? <div className="hero-aside">{aside}</div> : null}
      <button
        type="button"
        className={`hero-toggle${needsRoom ? ' is-needed' : ''}`}
        onClick={onToggle}
        aria-expanded={!collapsed}
        title={collapsed ? 'Expand hero (H)' : needsRoom ? 'The stage needs room: collapse the hero (H, or the next forward click)' : 'Collapse hero (H)'}
      >
        {collapsed ? '▾' : '▴'}
      </button>
    </header>
  )
}
