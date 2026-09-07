import type { ReactNode } from 'react'
import { useStepHandler } from '../../app/steps'

export interface TabDef {
  id: string
  label: string
  render: () => ReactNode
}

export function Tabs({ tabs, active, onChange, registerKeys = true }: { tabs: TabDef[]; active: string; onChange: (id: string) => void; registerKeys?: boolean }) {
  const index = Math.max(
    0,
    tabs.findIndex((t) => t.id === active),
  )
  useStepHandler(
    () => {
      if (!registerKeys || index >= tabs.length - 1) return false
      onChange(tabs[index + 1].id)
      return true
    },
    () => {
      if (!registerKeys || index <= 0) return false
      onChange(tabs[index - 1].id)
      return true
    },
  )
  const current = tabs[index]
  return (
    <div className="tabbed">
      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} type="button" role="tab" className="tab" aria-selected={t.id === current.id} onClick={() => onChange(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="tab-panel fade-in" role="tabpanel" key={current.id}>
        {current.render()}
      </div>
    </div>
  )
}
