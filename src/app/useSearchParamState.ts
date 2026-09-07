import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Widget state that should survive a reload and be shareable as a link:
 * stored in the URL search params, replaced in place (no history entries).
 */
export function useSearchParamState(
  key: string,
  fallback: string,
): [string, (next: string | null) => void] {
  const [params, setParams] = useSearchParams()
  const value = params.get(key) ?? fallback
  const set = useCallback(
    (next: string | null) => {
      setParams(
        (prev) => {
          const copy = new URLSearchParams(prev)
          if (next === null || next === fallback) copy.delete(key)
          else copy.set(key, next)
          return copy
        },
        { replace: true },
      )
    },
    [key, fallback, setParams],
  )
  return [value, set]
}

export function useSearchParamNumber(key: string, fallback: number): [number, (next: number) => void] {
  const [raw, set] = useSearchParamState(key, String(fallback))
  const parsed = Number.parseInt(raw, 10)
  const value = Number.isFinite(parsed) ? parsed : fallback
  const setNumber = useCallback((next: number) => set(next === fallback ? null : String(next)), [set, fallback])
  return [value, setNumber]
}

export function useSearchParamList(key: string): [string[], (next: string[]) => void] {
  const [raw, set] = useSearchParamState(key, '')
  const list = raw ? raw.split(',').filter(Boolean) : []
  const setList = useCallback((next: string[]) => set(next.length ? next.join(',') : null), [set])
  return [list, setList]
}
