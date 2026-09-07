import { useEffect, useRef } from 'react'

/**
 * A page can register step handlers so that Space advances its internal
 * steps (a stepper, a tab bar, a reveal list) before moving to the next page.
 * Handlers form a stack: the most recently mounted widget gets the key first
 * and passes it down when it has nothing left to do.
 */
export interface StepHandler {
  next(): boolean
  prev(): boolean
}

interface Entry {
  handler: StepHandler
  /** Higher priority is asked first; inner widgets (a stepper inside a tab) use 1, pages and tab bars 0. */
  priority: number
  seq: number
}

const stack: Entry[] = []
let seq = 0

function ordered(): Entry[] {
  return [...stack].sort((a, b) => b.priority - a.priority || b.seq - a.seq)
}

export function registerStepHandler(handler: StepHandler, priority = 0): () => void {
  seq += 1
  const entry: Entry = { handler, priority, seq }
  stack.push(entry)
  return () => {
    const i = stack.indexOf(entry)
    if (i >= 0) stack.splice(i, 1)
  }
}

export function stepNext(): boolean {
  for (const entry of ordered()) if (entry.handler.next()) return true
  return false
}

export function stepPrev(): boolean {
  for (const entry of ordered()) if (entry.handler.prev()) return true
  return false
}

/** Register a handler for the lifetime of the component; callbacks may change freely. */
export function useStepHandler(next: () => boolean, prev: () => boolean, priority = 0): void {
  const ref = useRef({ next, prev })
  useEffect(() => {
    ref.current = { next, prev }
  })
  useEffect(
    () => registerStepHandler({ next: () => ref.current.next(), prev: () => ref.current.prev() }, priority),
    [priority],
  )
}

/** Space moves through `count` items; returns false at the ends so the page advances. */
export function useCycleSteps(index: number, count: number, set: (i: number) => void): void {
  useStepHandler(
    () => {
      if (index >= count - 1) return false
      set(index + 1)
      return true
    },
    () => {
      if (index <= 0) return false
      set(index - 1)
      return true
    },
  )
}
