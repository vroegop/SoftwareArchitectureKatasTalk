import type { PageDef } from '../../content/types'
import { talkPosition } from '../../app/registry'

export function ProgressBar({ page }: { page?: PageDef }) {
  const { index, total } = page ? talkPosition(page.id) : { index: 0, total: 1 }
  const pct = total > 1 ? (index / (total - 1)) * 100 : 0
  return (
    <div className="progress" aria-hidden="true">
      <div className="progress-bar" style={{ width: `${pct}%` }} />
    </div>
  )
}
