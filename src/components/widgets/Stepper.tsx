import type { ReactNode } from 'react'
import { useStepHandler } from '../../app/steps'

export interface StepDef {
  id: string
  title: string
  kicker?: string
  render: () => ReactNode
}

export interface StepperProps {
  steps: StepDef[]
  active: number
  onChange: (index: number) => void
  /** Let Space advance the steps before moving to the next page. */
  registerKeys?: boolean
  compact?: boolean
}

export function Stepper({ steps, active, onChange, registerKeys = true, compact = false }: StepperProps) {
  const clamped = Math.min(Math.max(active, 0), steps.length - 1)
  useStepHandler(
    () => {
      if (!registerKeys || clamped >= steps.length - 1) return false
      onChange(clamped + 1)
      return true
    },
    () => {
      if (!registerKeys || clamped <= 0) return false
      onChange(clamped - 1)
      return true
    },
    1,
  )
  const step = steps[clamped]
  return (
    <div className={`stepper${compact ? ' stepper-compact' : ''}`}>
      <ol className="stepper-steps" aria-label="Steps">
        {steps.map((s, i) => (
          <li key={s.id}>
            <button type="button" className={`stepper-step${i === clamped ? ' is-active' : i < clamped ? ' is-done' : ''}`} onClick={() => onChange(i)} aria-current={i === clamped ? 'step' : undefined}>
              <span className="stepper-num mono">{i + 1}</span>
              <span className="stepper-title">{s.title}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="stepper-panel fade-in" key={step.id}>
        {step.kicker ? <p className="eyebrow">{step.kicker}</p> : null}
        {step.render()}
      </div>
      <div className="stepper-nav row-between">
        <button type="button" className="btn btn-sm" onClick={() => onChange(clamped - 1)} disabled={clamped === 0}>
          ← Previous
        </button>
        <span className="small muted mono">
          {clamped + 1} / {steps.length}
        </span>
        <button type="button" className="btn btn-sm" onClick={() => onChange(clamped + 1)} disabled={clamped === steps.length - 1}>
          Next →
        </button>
      </div>
    </div>
  )
}
