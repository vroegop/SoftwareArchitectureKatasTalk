import { createStore, useStore } from './createStore'

export interface LastKey {
  label: string
  action: string
  at: number
}

/** The last key the deck received, for the clicker tester in the help panel. */
export const keyStore = createStore<LastKey | null>(null)

export function recordKey(label: string, action: string): void {
  keyStore.set({ label, action, at: Date.now() })
}

export function useLastKey(): LastKey | null {
  return useStore(keyStore)
}
