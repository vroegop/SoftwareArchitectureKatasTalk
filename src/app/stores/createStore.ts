import { useSyncExternalStore } from 'react'
import { safeStorage } from './safeStorage'

export interface Store<T> {
  get(): T
  set(next: T | ((prev: T) => T)): void
  subscribe(listener: () => void): () => void
}

/**
 * Minimal external store usable with `useSyncExternalStore`. When `persistKey`
 * is given the state is loaded from and written to `safeStorage`.
 */
export function createStore<T>(initial: T, persistKey?: string, migrate?: (raw: unknown) => T | undefined): Store<T> {
  let state: T = initial
  if (persistKey) {
    const stored = safeStorage.get<unknown>(persistKey)
    if (stored !== undefined) {
      const migrated = migrate ? migrate(stored) : (stored as T)
      if (migrated !== undefined) state = migrated
    }
  }
  const listeners = new Set<() => void>()
  return {
    get: () => state,
    set: (next) => {
      const value = typeof next === 'function' ? (next as (prev: T) => T)(state) : next
      if (Object.is(value, state)) return
      state = value
      if (persistKey) safeStorage.set(persistKey, state)
      listeners.forEach((l) => l())
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.get)
}
