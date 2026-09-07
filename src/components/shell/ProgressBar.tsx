import type { PageDef } from '../../content/types'
import { mainTrack, progressIndex } from '../../app/registry'

export function ProgressBar({ page }: { page?: PageDef }) {
  const index = page ? progressIndex(page.id) : 0
  const pct = mainTrack.length > 1 ? (index / (mainTrack.length - 1)) * 100 : 0
  return (
    <div className="progress" aria-hidden="true">
      <div className="progress-bar" style={{ width: `${pct}%` }} />
    </div>
  )
}
