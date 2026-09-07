import { Link } from 'react-router-dom'
import { useCurrentPage } from '../../app/useCurrentPage'
import { sectionGroups, subTrackOf } from '../../app/registry'
import { ui } from '../../app/stores/uiStore'
import { Dialog } from './Dialog'

export function TocOverlay({ open }: { open: boolean }) {
  const current = useCurrentPage()
  const groups = sectionGroups()
  const numbers = new Map<string, number>()
  groups.forEach((group) => group.pages.forEach((p) => numbers.set(p.id, numbers.size + 1)))
  return (
    <Dialog open={open} onClose={ui.closeOverlay} title="Contents" className="dialog-toc">
      <div className="toc">
        {groups.map((group) => (
          <section key={group.id} className="toc-section">
            <h3 className="eyebrow">{group.label}</h3>
            <ol className="toc-list">
              {group.pages.map((page) => {
                const counter = numbers.get(page.id) ?? 0
                const subs = subTrackOf(page.id)
                const isCurrent = current?.id === page.id || current?.parent === page.id
                return (
                  <li key={page.id} className={isCurrent ? 'is-current' : undefined}>
                    <Link to={page.path} onClick={ui.closeOverlay} className="toc-link">
                      <span className="toc-num mono">{counter}</span>
                      <span className="toc-title">{page.title}</span>
                      {page.minute !== undefined ? <span className="toc-minute mono muted">{page.minute}'</span> : null}
                    </Link>
                    {subs.length > 0 ? (
                      <details className="toc-subs" open={isCurrent}>
                        <summary className="small muted">{subs.length} deep-dive pages</summary>
                        <ol className="toc-sublist">
                          {subs.map((sub, i) => (
                            <li key={sub.id} className={current?.id === sub.id ? 'is-current' : undefined}>
                              <Link to={sub.path} onClick={ui.closeOverlay} className="toc-link">
                                <span className="toc-num mono">
                                  {counter}.{i + 1}
                                </span>
                                <span className="toc-title">{sub.title}</span>
                              </Link>
                            </li>
                          ))}
                        </ol>
                      </details>
                    ) : null}
                  </li>
                )
              })}
            </ol>
          </section>
        ))}
      </div>
    </Dialog>
  )
}
