import type { TimerPreset } from '../../content/types'
import { formatClock, timer, useTimer } from '../../app/stores/timerStore'
import { ui } from '../../app/stores/uiStore'

/** Large timer for the hero of live-round pages. */
export function BigTimer({ preset, label }: { preset: TimerPreset; label?: string }) {
  const state = useTimer()
  const idle = state.status === 'idle'
  const seconds = idle ? preset.seconds : state.remaining
  return (
    <div className={`big-timer timer-${state.status}`} data-keys="local">
      <span className="big-timer-digits mono" aria-live="polite">
        {formatClock(seconds)}
      </span>
      <span className="big-timer-label">{idle ? preset.label : (state.label ?? preset.label)}</span>
      <div className="btn-group">
        {idle || state.status === 'done' ? (
          <button type="button" className="btn btn-primary" onClick={() => timer.start(preset.seconds, label ?? preset.label)}>
            Start {Math.round(preset.seconds / 60)} min
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={timer.toggle}>
            {state.status === 'running' ? 'Pause' : 'Resume'}
          </button>
        )}
        <button type="button" className="btn btn-sm" onClick={() => timer.addSeconds(60)} disabled={idle || state.status === 'done'}>
          +1
        </button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={timer.reset} disabled={idle}>
          Reset
        </button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => ui.openOverlay('timer')} title="Timer panel (C)">
          ⋯
        </button>
      </div>
    </div>
  )
}

export function TimerButton({ preset, label }: { preset: TimerPreset; label?: string }) {
  return (
    <button type="button" className="btn btn-sm" onClick={() => timer.start(preset.seconds, label ?? preset.label)}>
      ⏱ Start {Math.round(preset.seconds / 60)} min
    </button>
  )
}
