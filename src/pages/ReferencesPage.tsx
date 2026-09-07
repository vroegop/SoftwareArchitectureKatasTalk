import type { PageProps } from '../app/pageComponents'
import { useSearchParamState } from '../app/useSearchParamState'
import { references } from '../content/references'
import type { ReferenceTopic, ReferenceType } from '../content/types'
import { PageShell } from '../components/shell/PageShell'

const TYPES: { id: ReferenceType | ''; label: string }[] = [
  { id: '', label: 'All' },
  { id: 'book', label: 'Books' },
  { id: 'site', label: 'Sites' },
  { id: 'tool', label: 'Tools' },
  { id: 'video', label: 'Videos' },
  { id: 'article', label: 'Articles' },
]

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
  const [type, setType] = useSearchParamState('type', '')
  const [topic, setTopic] = useSearchParamState('topic', '')
  const visible = references.filter((r) => (!type || r.type === type) && (!topic || r.topics.includes(topic as ReferenceTopic)))
  return (
    <PageShell page={page}>
      <div className="stack">
        <div className="row-between" data-keys="local">
          <div className="row">
            {TYPES.map((t) => (
              <button key={t.id} type="button" className="pick-chip" aria-pressed={type === t.id} onClick={() => setType(t.id || null)}>
                {t.label}
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
        <ul className="ref-list">
          {visible.map((r) => (
            <li key={r.id} className="ref-item">
              <span className="ref-type">{r.type}</span>
              <span>
                <a className="ref-title" href={r.url} target="_blank" rel="noreferrer">
                  {r.title}
                </a>
                {r.by ? <span className="muted"> · {r.by}</span> : null}
                <br />
                <span className="small">{r.note}</span>{' '}
                {r.topics.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  )
}
