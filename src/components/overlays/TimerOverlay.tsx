import { useState } from 'react'
import { timerPresets } from '../../content/timers'
import { useStore } from '../../app/stores/createStore'
import { setSetting, settingsStore } from '../../app/stores/settingsStore'
import { formatClock, timer, useTimer } from '../../app/stores/timerStore'
import { ui } from '../../app/stores/uiStore'
import { Dialog } from './Dialog'

export function TimerOverlay({ open }: { open: boolean }) {
  const state = useTimer()
  const settings = useStore(settingsStore)
  const [custom, setCustom] = useState(10)

  return (
    <Dialog
      open={open}
      onClose={ui.closeOverlay}
      title="Round timer"
      className="dialog-timer"
      onKeyDown={(e) => {
        const target = e.target as HTMLElement
        if (target.tagName === 'INPUT') return
        if (e.key === ' ') {
          e.preventDefault()
          if (state.status === 'idle' || state.status === 'done') timer.start(custom * 60, `${custom} minutes`)
          else timer.toggle()
        } else if (e.key === 'r' || e.key === 'R') {
          timer.reset()
        } else if (/^[1-5]$/.test(e.key)) {
          const preset = timerPresets[Number(e.key) - 1]
          if (preset) timer.start(preset.seconds, preset.label)
        }
      }}
    >
      <div className="timer-panel" data-keys="local">
        <div className={`timer-clock timer-${state.status}`} aria-live="polite">
          <span className="timer-digits mono">{formatClock(state.status === 'idle' ? custom * 60 : state.remaining)}</span>
          <span className="timer-label muted">{state.label ?? (state.status === 'idle' ? 'ready' : '')}</span>
        </div>
        <div className="btn-group timer-controls">
          {state.status === 'idle' || state.status === 'done' ? (
            <button type="button" className="btn btn-primary" onClick={() => timer.start(custom * 60, `${custom} minutes`)}>
              Start {custom} min
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={timer.toggle}>
              {state.status === 'running' ? 'Pause' : 'Resume'}
            </button>
          )}
          <button type="button" className="btn" onClick={() => timer.addSeconds(60)} disabled={state.status === 'idle' || state.status === 'done'}>
            +1 min
          </button>
          <button type="button" className="btn" onClick={() => timer.addSeconds(-60)} disabled={state.status === 'idle' || state.status === 'done'}>
            −1 min
          </button>
          <button type="button" className="btn btn-ghost" onClick={timer.reset}>
            Reset
          </button>
        </div>
        <div className="timer-presets">
          <p className="eyebrow">Presets</p>
          <div className="btn-group">
            {timerPresets.map((preset, i) => (
              <button
                key={preset.id}
                type="button"
                className="btn"
                onClick={() => timer.start(preset.seconds, preset.label)}
                title={`Key ${i + 1}`}
              >
                <kbd>{i + 1}</kbd> {preset.label} · {Math.round(preset.seconds / 60)} min
              </button>
            ))}
          </div>
        </div>
        <div className="row timer-custom">
          <label htmlFor="timer-custom">Custom minutes</label>
          <input
            id="timer-custom"
            type="number"
            min={1}
            max={180}
            value={custom}
            onChange={(e) => setCustom(Math.max(1, Math.min(180, Number(e.target.value) || 1)))}
          />
          <label className="row">
            <input type="checkbox" checked={settings.sound} onChange={(e) => setSetting('sound', e.target.checked)} /> beep at
            zero
          </label>
        </div>
        <p className="small muted">
          Keys inside this panel: <kbd>Space</kbd> start or pause, <kbd>R</kbd> reset, <kbd>1</kbd>–<kbd>5</kbd> presets. The
          timer keeps running when you change pages or reload.
        </p>
      </div>
    </Dialog>
  )
}
