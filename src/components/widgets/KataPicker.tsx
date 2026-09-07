import { useEffect, useRef, useState } from 'react'
import type { Kata } from '../../content/types'

/** Random pick with a short title-cycling animation (skipped under reduced motion). */
export function KataPicker({ katas, usedIds, onPick }: { katas: Kata[]; usedIds: string[]; onPick: (id: string) => void }) {
  const [spinning, setSpinning] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearInterval(timer.current), [])

  function pickRandom(): void {
    const fresh = katas.filter((k) => !usedIds.includes(k.id))
    const pool = fresh.length > 0 ? fresh : katas
    const chosen = pool[Math.floor(Math.random() * pool.length)]
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || katas.length < 2) {
      onPick(chosen.id)
      return
    }
    let ticks = 0
    window.clearInterval(timer.current)
    timer.current = window.setInterval(() => {
      ticks += 1
      setSpinning(katas[ticks % katas.length].title)
      if (ticks >= 14) {
        window.clearInterval(timer.current)
        setSpinning(null)
        onPick(chosen.id)
      }
    }, 80)
  }

  return (
    <div className="picker">
      <button type="button" className="btn btn-primary btn-lg" onClick={pickRandom} disabled={spinning !== null}>
        {spinning ? spinning : 'Pick a random kata'}
      </button>
      <details className="picker-choose">
        <summary className="btn btn-ghost">…or choose one</summary>
        <ul className="picker-list">
          {katas.map((k) => (
            <li key={k.id}>
              <button type="button" className={`btn btn-sm${usedIds.includes(k.id) ? ' btn-ghost' : ''}`} onClick={() => onPick(k.id)}>
                {k.title} <span className="chip">{k.difficulty}</span>
              </button>
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}
