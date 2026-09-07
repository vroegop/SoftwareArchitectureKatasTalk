import { createStore, useStore } from './createStore'

export interface DebriefPin {
  id: string
  group: string
  text: string
}

export interface LiveState {
  /** Kata chosen for the live round. */
  kataId?: string
  participants: number
  /** Ids already picked this session, so the random picker avoids repeats. */
  usedKataIds: string[]
  /** Checklist ticks keyed by `${listId}:${itemIndex}`. */
  checks: Record<string, boolean>
  pins: DebriefPin[]
}

const defaults: LiveState = { participants: 16, usedKataIds: [], checks: {}, pins: [] }

export const liveStore = createStore<LiveState>(defaults, 'live', (raw) => {
  if (!raw || typeof raw !== 'object') return undefined
  const r = raw as Partial<LiveState>
  return {
    kataId: typeof r.kataId === 'string' ? r.kataId : undefined,
    participants: typeof r.participants === 'number' ? r.participants : defaults.participants,
    usedKataIds: Array.isArray(r.usedKataIds) ? r.usedKataIds.filter((x) => typeof x === 'string') : [],
    checks: r.checks && typeof r.checks === 'object' ? r.checks : {},
    pins: Array.isArray(r.pins) ? r.pins : [],
  }
})

export const live = {
  pickKata(kataId: string): void {
    liveStore.set((s) => ({
      ...s,
      kataId,
      usedKataIds: s.usedKataIds.includes(kataId) ? s.usedKataIds : [...s.usedKataIds, kataId],
    }))
  },
  clearKata(): void {
    liveStore.set((s) => ({ ...s, kataId: undefined }))
  },
  setParticipants(n: number): void {
    liveStore.set((s) => ({ ...s, participants: Math.max(2, Math.min(200, Math.round(n))) }))
  },
  toggleCheck(listId: string, index: number): void {
    const key = `${listId}:${index}`
    liveStore.set((s) => ({ ...s, checks: { ...s.checks, [key]: !s.checks[key] } }))
  },
  resetChecks(listId: string): void {
    liveStore.set((s) => ({
      ...s,
      checks: Object.fromEntries(Object.entries(s.checks).filter(([k]) => !k.startsWith(`${listId}:`))),
    }))
  },
  addPin(group: string, text: string): void {
    liveStore.set((s) => ({ ...s, pins: [...s.pins, { id: `${Date.now().toString(36)}-${s.pins.length}`, group, text }] }))
  },
  removePin(id: string): void {
    liveStore.set((s) => ({ ...s, pins: s.pins.filter((p) => p.id !== id) }))
  },
  clearPins(): void {
    liveStore.set((s) => ({ ...s, pins: [] }))
  },
  reset(): void {
    liveStore.set(defaults)
  },
}

export function useLive(): LiveState {
  return useStore(liveStore)
}

/** Suggested number of groups for a headcount, aiming at 3–5 people per group. */
export function suggestGroups(participants: number): { groups: number; size: string } {
  if (participants <= 5) return { groups: 1, size: `${participants}` }
  const groups = Math.max(2, Math.round(participants / 4))
  const min = Math.floor(participants / groups)
  const max = Math.ceil(participants / groups)
  return { groups, size: min === max ? `${min}` : `${min}–${max}` }
}
