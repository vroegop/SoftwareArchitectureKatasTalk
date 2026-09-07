/**
 * localStorage wrapper that never throws (private mode, blocked storage,
 * thumbnail renderers) and falls back to an in-memory map for the session.
 */
const PREFIX = 'akc4.'
const memory = new Map<string, string>()

function ls(): Storage | undefined {
  try {
    return typeof window !== 'undefined' ? window.localStorage : undefined
  } catch {
    return undefined
  }
}

export const safeStorage = {
  get<T>(key: string): T | undefined {
    const full = PREFIX + key
    let raw: string | null | undefined
    try {
      raw = ls()?.getItem(full)
    } catch {
      raw = undefined
    }
    if (raw == null) raw = memory.get(full) ?? null
    if (raw == null) return undefined
    try {
      return JSON.parse(raw) as T
    } catch {
      return undefined
    }
  },
  set(key: string, value: unknown): void {
    const full = PREFIX + key
    const raw = JSON.stringify(value)
    memory.set(full, raw)
    try {
      ls()?.setItem(full, raw)
    } catch {
      /* storage unavailable or full: memory copy still works for this session */
    }
  },
  remove(key: string): void {
    const full = PREFIX + key
    memory.delete(full)
    try {
      ls()?.removeItem(full)
    } catch {
      /* ignore */
    }
  },
  clearAll(): void {
    for (const key of Array.from(memory.keys())) memory.delete(key)
    try {
      const store = ls()
      if (!store) return
      const doomed: string[] = []
      for (let i = 0; i < store.length; i += 1) {
        const k = store.key(i)
        if (k && k.startsWith(PREFIX)) doomed.push(k)
      }
      doomed.forEach((k) => store.removeItem(k))
    } catch {
      /* ignore */
    }
  },
}
