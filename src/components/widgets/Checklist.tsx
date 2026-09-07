import type { ChecklistDef } from '../../content/widgets'
import { live, useLive } from '../../app/stores/liveStore'

export function Checklist({ list, big = false }: { list: ChecklistDef; big?: boolean }) {
  const state = useLive()
  const done = list.items.filter((_, i) => state.checks[`${list.id}:${i}`]).length
  return (
    <section className={`checklist-box${big ? ' checklist-big' : ''}`}>
      <div className="row-between">
        <h3 className="card-title">{list.title}</h3>
        <span className="chip">
          {done} / {list.items.length}
        </span>
      </div>
      <ul className="checklist">
        {list.items.map((item, i) => {
          const key = `${list.id}:${i}`
          const checked = Boolean(state.checks[key])
          return (
            <li key={key} className={checked ? 'is-done' : undefined}>
              <label>
                <input type="checkbox" checked={checked} onChange={() => live.toggleCheck(list.id, i)} />
                <span className="checklist-label">{item.label}</span>
                {item.hint ? <span className="checklist-hint muted">{item.hint}</span> : null}
              </label>
            </li>
          )
        })}
      </ul>
      {done > 0 ? (
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => live.resetChecks(list.id)}>
          Reset ticks
        </button>
      ) : null}
    </section>
  )
}
