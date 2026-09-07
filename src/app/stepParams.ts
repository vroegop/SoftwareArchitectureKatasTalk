import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Step state that lives in the URL. Arriving with `?at=end` (the back button
 * from the next page) opens a page in its final state: last step, last tab,
 * everything revealed. An explicit step param always wins over `at=end`.
 */
export function useAtEnd(): boolean {
  const [params] = useSearchParams()
  return params.get('at') === 'end'
}

function clamp(n: number, max: number): number {
  return Math.min(Math.max(n, 0), Math.max(0, max))
}

export function useStepIndex(key: string, count: number): [number, (index: number) => void] {
  const [params, setParams] = useSearchParams()
  const raw = params.get(key)
  const atEnd = params.get('at') === 'end'
  const parsed = raw === null ? Number.NaN : Number.parseInt(raw, 10)
  const value = Number.isFinite(parsed) ? clamp(parsed, count - 1) : atEnd ? Math.max(0, count - 1) : 0
  const set = useCallback(
    (index: number) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (index <= 0 && !next.has('at')) next.delete(key)
          else next.set(key, String(Math.max(0, index)))
          return next
        },
        { replace: true },
      )
    },
    [key, setParams],
  )
  return [value, set]
}

export function useStepId(key: string, ids: readonly string[]): [string, (id: string) => void] {
  const [params, setParams] = useSearchParams()
  const raw = params.get(key)
  const atEnd = params.get('at') === 'end'
  const value = raw !== null && ids.includes(raw) ? raw : atEnd ? ids[ids.length - 1] : ids[0]
  const set = useCallback(
    (id: string) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (id === ids[0] && !next.has('at')) next.delete(key)
          else next.set(key, id)
          return next
        },
        { replace: true },
      )
    },
    [key, ids, setParams],
  )
  return [value, set]
}
