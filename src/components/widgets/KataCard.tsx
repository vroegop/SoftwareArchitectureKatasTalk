import type { ReactNode } from 'react'
import type { Kata } from '../../content/types'

export function KataCard({ kata, compact = false, showHints = false, actions }: { kata: Kata; compact?: boolean; showHints?: boolean; actions?: ReactNode }) {
  return (
    <article className={`kata-card${compact ? ' kata-card-compact' : ''}`}>
      <header className="kata-head">
        <div>
          <p className="eyebrow">Kata · {kata.difficulty}</p>
          <h3 className="kata-title">{kata.title}</h3>
        </div>
        {actions ? <div className="kata-actions">{actions}</div> : null}
      </header>
      <p className="kata-summary">{kata.summary}</p>
      <dl className="kata-body">
        <div>
          <dt>Users</dt>
          <dd>{kata.users}</dd>
        </div>
        <div>
          <dt>Requirements</dt>
          <dd>
            <ul className="bullets">
              {kata.requirements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>Additional context</dt>
          <dd>
            <ul className="bullets">
              {kata.additionalContext.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
      <footer className="kata-foot">
        <div className="row">
          {kata.tags.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
        <p className="small muted">
          Source:{' '}
          <a href={kata.sourceUrl} target="_blank" rel="noreferrer">
            {kata.sourceName}
          </a>{' '}
          · {kata.author}
        </p>
        {showHints ? (
          <details className="kata-hints">
            <summary>Facilitator hints (presenter only)</summary>
            <ul className="bullets">
              {kata.goodFor.map((g) => (
                <li key={g}>{g}</li>
              ))}
              {kata.facilitatorHints.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </details>
        ) : null}
      </footer>
    </article>
  )
}
