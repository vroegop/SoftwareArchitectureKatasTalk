import { formatClock, useTimer } from '../../app/stores/timerStore'
import { ui } from '../../app/stores/uiStore'

export function TimerPill() {
  const state = useTimer()
  const label = state.status === 'idle' ? 'Timer' : formatClock(state.remaining)
  return (
    <button
      type="button"
      className={`timer-pill timer-${state.status}`}
      onClick={() => ui.openOverlay('timer')}
      title="Round timer (C)"
      aria-live={state.status === 'done' ? 'assertive' : 'off'}
    >
      <span className="timer-pill-dot" aria-hidden="true" />
      <span className="mono">{label}</span>
      {state.label && state.status !== 'idle' ? <span className="timer-pill-label">{state.label}</span> : null}
    </button>
  )
}
