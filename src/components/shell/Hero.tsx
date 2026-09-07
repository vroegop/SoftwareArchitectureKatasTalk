import type { ReactNode } from 'react'
import type { HeroSpec } from '../../content/types'

export interface HeroProps {
  hero: HeroSpec
  aside?: ReactNode
  collapsed: boolean
  onToggle: () => void
}

export function Hero({ hero, aside, collapsed, onToggle }: HeroProps) {
  return (
    <header className="hero">
      <div className="hero-copy">
        {hero.kicker ? <p className="eyebrow hero-kicker">{hero.kicker}</p> : null}
        <h1 className="hero-title">{hero.title}</h1>
        {!collapsed ? (
          <>
            {hero.subtitle ? <p className="hero-subtitle">{hero.subtitle}</p> : null}
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
          </>
        ) : null}
      </div>
      {aside ? <div className="hero-aside">{aside}</div> : null}
      <button
        type="button"
        className="hero-toggle"
        onClick={onToggle}
        aria-expanded={!collapsed}
        title={collapsed ? 'Expand hero (H)' : 'Collapse hero (H)'}
      >
        {collapsed ? '▾' : '▴'}
      </button>
    </header>
  )
}
