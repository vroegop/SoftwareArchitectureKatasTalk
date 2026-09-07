import { useEffect, useState } from 'react'
import { settingsStore } from '../../app/stores/settingsStore'
import { timer } from '../../app/stores/timerStore'

function beep(): void {
  try {
    const Ctx = window.AudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const now = ctx.currentTime
    ;[0, 0.35, 0.7].forEach((offset) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.0001, now + offset)
      gain.gain.exponentialRampToValueAtTime(0.3, now + offset + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.25)
      osc.connect(gain).connect(ctx.destination)
      osc.start(now + offset)
      osc.stop(now + offset + 0.3)
    })
    window.setTimeout(() => void ctx.close(), 1500)
  } catch {
    /* audio not available */
  }
}

/** Flashes the screen edge and beeps when the round timer reaches zero. */
export function TimerAlarm() {
  const [flash, setFlash] = useState(false)
  useEffect(
    () =>
      timer.onDone(() => {
        if (settingsStore.get().sound) beep()
        setFlash(true)
        window.setTimeout(() => setFlash(false), 2500)
      }),
    [],
  )
  return flash ? <div className="timer-flash" aria-hidden="true" /> : null
}
