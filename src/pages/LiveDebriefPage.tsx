import { useState } from 'react'
import type { PageProps } from '../app/pageComponents'
import { useAtEnd } from '../app/stepParams'
import { useStepHandler } from '../app/steps'
import { live, useLive } from '../app/stores/liveStore'
import { debriefPrompts } from '../content/live'
import { PageShell } from '../components/shell/PageShell'

export default function LiveDebriefPage({ page }: PageProps) {
  const state = useLive()
  const atEnd = useAtEnd()
  const [shown, setShown] = useState(atEnd ? debriefPrompts.length : 1)
  const [group, setGroup] = useState('')
  const [text, setText] = useState('')
  const pins = state.pins.filter((p) => p.group !== 'parked')
  useStepHandler(
    () => {
      if (shown >= debriefPrompts.length) return false
      setShown(shown + 1)
      return true
    },
    () => {
      if (shown <= 1) return false
      setShown(shown - 1)
      return true
    },
  )

  return (
    <PageShell page={page}>
      <div className="stage-split-even stage-split">
        <section className="stack-sm">
          <div className="row-between">
            <p className="eyebrow">Reflection, one prompt at a time</p>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => setShown(shown >= debriefPrompts.length ? 1 : debriefPrompts.length)}>
              {shown >= debriefPrompts.length ? 'Hide again' : 'Show all'}
            </button>
          </div>
          <div className="prompt-cards">
            {debriefPrompts.map((prompt, i) => (
              <button key={prompt} type="button" className={`prompt-card${i < shown ? '' : ' is-hidden'}`} onClick={() => setShown(i + 1)} aria-label={i < shown ? prompt : 'Hidden prompt'}>
                {prompt}
              </button>
            ))}
          </div>
        </section>
        <section className="stack-sm" data-keys="local">
          <p className="eyebrow">The trade-off board: one key choice per group</p>
          <form
            className="pin-form"
            onSubmit={(e) => {
              e.preventDefault()
              if (!text.trim()) return
              live.addPin(group.trim() || `Group ${pins.length + 1}`, text.trim())
              setText('')
            }}
          >
            <input type="text" value={group} onChange={(e) => setGroup(e.target.value)} placeholder="Group" aria-label="Group name" />
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="We chose … because …" aria-label="Choice" />
            <button type="submit" className="btn btn-sm btn-primary">
              Pin it
            </button>
          </form>
          {pins.length > 0 ? (
            <>
              <ul className="pin-list">
                {pins.map((p) => (
                  <li key={p.id} className="pin">
                    <span className="pin-group">{p.group}</span>
                    <span style={{ flex: 1 }}>{p.text}</span>
                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => live.removePin(p.id)} aria-label="Remove">
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className="btn btn-sm btn-ghost" onClick={live.clearPins}>
                Clear the board
              </button>
            </>
          ) : (
            <p className="small muted">Same kata, different diagrams, none of them wrong. Pin what each group optimised for.</p>
          )}
        </section>
      </div>
    </PageShell>
  )
}
