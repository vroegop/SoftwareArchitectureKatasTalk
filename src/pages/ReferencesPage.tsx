import type { PageProps } from '../app/pageComponents'
import { useStepId } from '../app/stepParams'
import { useSearchParamState } from '../app/useSearchParamState'
import { references } from '../content/references'
import type { ReferenceTopic, ReferenceType } from '../content/types'
import { PageShell } from '../components/shell/PageShell'

/** The reference groups the forward key walks through; "all" is the final overview. */
const GROUPS: { id: string; label: string; types: ReferenceType[] }[] = [
  { id: 'book', label: 'Books', types: ['book'] },
  { id: 'site', label: 'Sites', types: ['site'] },
  { id: 'tool', label: 'Tools', types: ['tool'] },
  { id: 'media', label: 'Videos and articles', types: ['video', 'article'] },
  { id: 'all', label: 'All', types: ['book', 'site', 'tool', 'video', 'article'] },
]
const GROUP_IDS = GROUPS.map((g) => g.id)

const TOPICS: { id: ReferenceTopic | ''; label: string }[] = [
  { id: '', label: 'Every topic' },
  { id: 'katas', label: 'Katas' },
  { id: 'c4', label: 'C4' },
  { id: 'styles', label: 'Styles' },
  { id: 'characteristics', label: 'Characteristics' },
  { id: 'techniques', label: 'Techniques' },
  { id: 'facilitation', label: 'Facilitation' },
]

export default function ReferencesPage({ page }: PageProps) {
  const [groupId, setGroup] = useStepId('type', GROUP_IDS)
  const [topic, setTopic] = useSearchParamState('topic', '')
  const group = GROUPS.find((g) => g.id === groupId) ?? GROUPS[0]
  const visible = references.filter((r) => group.types.includes(r.type) && (!topic || r.topics.includes(topic as ReferenceTopic)))
  const compact = group.id === 'all'
  return (
    <PageShell page={page}>
      <div className="stack">
        <div className="row-between" data-keys="local">
          <div className="row">
            {GROUPS.map((g) => (
              <button key={g.id} type="button" className="pick-chip" aria-pressed={group.id === g.id} onClick={() => setGroup(g.id)}>
                {g.label}
              </button>
            ))}
          </div>
          <div className="row">
            {TOPICS.map((t) => (
              <button key={t.id} type="button" className="pick-chip" aria-pressed={topic === t.id} onClick={() => setTopic(t.id || null)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <ul className={`ref-list${compact ? ' is-compact' : ''}`}>
          {visible.map((r) => (
            <li key={r.id} className="ref-item">
              <span className="ref-type">{r.type}</span>
              <span>
                <a className="ref-title" href={r.url} target="_blank" rel="noreferrer" title={r.note}>
                  {r.title}
                </a>
                {r.by ? <span className="muted"> · {r.by}</span> : null}
                {compact ? null : (
                  <>
                    <br />
                    <span className="small">{r.note}</span>{' '}
                    {r.topics.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
        {visible.length === 0 ? <p className="muted">Nothing in this group for that topic.</p> : null}
      </div>
    </PageShell>
  )
}
