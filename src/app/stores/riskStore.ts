import type { RiskLevel, RiskSticky, SeedRisk } from '../../content/types'
import { createStore, useStore } from './createStore'

export type RiskState = Record<string, RiskSticky[]>

export const riskStore = createStore<RiskState>({}, 'risk', (raw) =>
  raw && typeof raw === 'object' ? (raw as RiskState) : undefined,
)

let counter = 0
function nextId(): string {
  counter += 1
  return `r-${Date.now().toString(36)}-${counter}`
}

export function riskScore(s: { probability: RiskLevel; impact: RiskLevel }): number {
  return s.probability * s.impact
}

export type RiskBand = 'low' | 'medium' | 'high'

export function riskBand(score: number): RiskBand {
  if (score >= 6) return 'high'
  if (score >= 3) return 'medium'
  return 'low'
}

export const risks = {
  add(diagramId: string, sticky: Omit<RiskSticky, 'id' | 'diagramId' | 'createdAt'>): RiskSticky {
    const created: RiskSticky = { ...sticky, id: nextId(), diagramId, createdAt: Date.now() }
    riskStore.set((state) => ({ ...state, [diagramId]: [...(state[diagramId] ?? []), created] }))
    return created
  },
  update(diagramId: string, id: string, patch: Partial<Omit<RiskSticky, 'id' | 'diagramId'>>): void {
    riskStore.set((state) => ({
      ...state,
      [diagramId]: (state[diagramId] ?? []).map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }))
  },
  remove(diagramId: string, id: string): void {
    riskStore.set((state) => ({ ...state, [diagramId]: (state[diagramId] ?? []).filter((s) => s.id !== id) }))
  },
  clear(diagramId: string): void {
    riskStore.set((state) => ({ ...state, [diagramId]: [] }))
  },
  seed(diagramId: string, seeds: SeedRisk[]): void {
    const now = Date.now()
    riskStore.set((state) => ({
      ...state,
      [diagramId]: seeds.map((s) => ({ ...s, id: nextId(), diagramId, createdAt: now })),
    }))
  },
}

const EMPTY: RiskSticky[] = []

export function useRisks(diagramId: string): RiskSticky[] {
  const state = useStore(riskStore)
  return state[diagramId] ?? EMPTY
}
