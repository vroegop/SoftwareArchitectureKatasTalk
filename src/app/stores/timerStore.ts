import { createStore, useStore } from './createStore'

export type TimerStatus = 'idle' | 'running' | 'paused' | 'done'

export interface TimerState {
  status: TimerStatus
  /** Total seconds of the current countdown. */
  total: number
  /** Seconds left; derived from `endsAt` while running. */
  remaining: number
  /** Wall-clock end while running (ms since epoch). */
  endsAt?: number
  label?: string
}

const idle: TimerState = { status: 'idle', total: 0, remaining: 0 }

function secondsLeft(endsAt: number, now = Date.now()): number {
  return Math.max(0, Math.ceil((endsAt - now) / 1000))
}

export const timerStore = createStore<TimerState>(idle, 'timer', (raw) => {
  if (!raw || typeof raw !== 'object') return undefined
  const r = raw as Partial<TimerState>
  if (r.status === 'running' && typeof r.endsAt === 'number') {
    const remaining = secondsLeft(r.endsAt)
    return remaining > 0
      ? { status: 'running', total: r.total ?? remaining, remaining, endsAt: r.endsAt, label: r.label }
      : { status: 'done', total: r.total ?? 0, remaining: 0, label: r.label }
  }
  if (r.status === 'paused' && typeof r.remaining === 'number') {
    return { status: 'paused', total: r.total ?? r.remaining, remaining: r.remaining, label: r.label }
  }
  if (r.status === 'done') return { status: 'done', total: r.total ?? 0, remaining: 0, label: r.label }
  return idle
})

let interval: number | undefined
const doneListeners = new Set<() => void>()

function tick(): void {
  const s = timerStore.get()
  if (s.status !== 'running' || s.endsAt === undefined) {
    ensureTicking()
    return
  }
  const remaining = secondsLeft(s.endsAt)
  if (remaining <= 0) {
    timerStore.set({ status: 'done', total: s.total, remaining: 0, label: s.label })
    doneListeners.forEach((l) => l())
  } else if (remaining !== s.remaining) {
    timerStore.set({ ...s, remaining })
  }
}

function ensureTicking(): void {
  if (typeof window === 'undefined') return
  const running = timerStore.get().status === 'running'
  if (running && interval === undefined) interval = window.setInterval(tick, 250)
  if (!running && interval !== undefined) {
    window.clearInterval(interval)
    interval = undefined
  }
}

export const timer = {
  start(seconds: number, label?: string): void {
    const total = Math.max(1, Math.round(seconds))
    timerStore.set({ status: 'running', total, remaining: total, endsAt: Date.now() + total * 1000, label })
    ensureTicking()
  },
  pause(): void {
    const s = timerStore.get()
    if (s.status !== 'running' || s.endsAt === undefined) return
    timerStore.set({ status: 'paused', total: s.total, remaining: secondsLeft(s.endsAt), label: s.label })
    ensureTicking()
  },
  resume(): void {
    const s = timerStore.get()
    if (s.status !== 'paused') return
    timerStore.set({ ...s, status: 'running', endsAt: Date.now() + s.remaining * 1000 })
    ensureTicking()
  },
  toggle(): void {
    const s = timerStore.get()
    if (s.status === 'running') timer.pause()
    else if (s.status === 'paused') timer.resume()
  },
  addSeconds(delta: number): void {
    const s = timerStore.get()
    if (s.status === 'running' && s.endsAt !== undefined) {
      const endsAt = Math.max(Date.now() + 1000, s.endsAt + delta * 1000)
      timerStore.set({ ...s, endsAt, remaining: secondsLeft(endsAt), total: Math.max(s.total, secondsLeft(endsAt)) })
    } else if (s.status === 'paused') {
      const remaining = Math.max(1, s.remaining + delta)
      timerStore.set({ ...s, remaining, total: Math.max(s.total, remaining) })
    }
  },
  reset(): void {
    timerStore.set(idle)
    ensureTicking()
  },
  onDone(listener: () => void): () => void {
    doneListeners.add(listener)
    return () => {
      doneListeners.delete(listener)
    }
  },
}

export function useTimer(): TimerState {
  return useStore(timerStore)
}

export function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

if (typeof window !== 'undefined') {
  ensureTicking()
  document.addEventListener('visibilitychange', tick)
}
