import type { Adr } from '../../content/types'

export function AdrView({ adr }: { adr: Adr }) {
  return (
    <article className="adr">
      <header className="adr-head">
        <p className="eyebrow">Architecture decision record</p>
        <h3 className="card-title">{adr.title}</h3>
        <p className="small muted">
          Status: <strong>{adr.status}</strong>
          {adr.date ? ` · ${adr.date}` : ''}
        </p>
      </header>
      <div className="adr-grid">
        <section>
          <h4 className="eyebrow">Context</h4>
          <ul className="bullets">
            {adr.context.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
        <section>
          <h4 className="eyebrow">Decision</h4>
          <ul className="bullets">
            {adr.decision.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
        <section>
          <h4 className="eyebrow">Consequences</h4>
          <ul className="bullets">
            {adr.consequences.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
        <section>
          <h4 className="eyebrow">Alternatives considered</h4>
          <ul className="bullets">
            {adr.alternatives.map((a) => (
              <li key={a.name}>
                <strong>{a.name}.</strong> {a.why}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  )
}
