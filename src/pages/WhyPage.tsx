import type { PageProps } from '../app/pageComponents'
import { useCycleSteps } from '../app/steps'
import { useStepId } from '../app/stepParams'
import { costRows, personas } from '../content/why'
import { PageShell } from '../components/shell/PageShell'
import { SegmentedControl } from '../components/widgets/SegmentedControl'

const PERSONA_IDS: string[] = personas.map((p) => p.id)

export default function WhyPage({ page }: PageProps) {
  const [personaId, setPersona] = useStepId('persona', PERSONA_IDS)
  const index = Math.max(0, PERSONA_IDS.indexOf(personaId))
  const persona = personas[index]
  useCycleSteps(index, personas.length, (i) => setPersona(personas[i].id))

  return (
    <PageShell page={page}>
      <div className="stage-split">
        <section className="stack">
          <SegmentedControl
            options={personas.map((p) => ({ id: p.id, label: p.label }))}
            value={persona.id}
            onChange={setPersona}
            ariaLabel="Who are you in the room"
            size="lg"
          />
          <div className="card persona-card fade-in" key={persona.id}>
            <p className="eyebrow">The fear</p>
            <p className="persona-fear">“{persona.fear}”</p>
            <p className="eyebrow">What a kata round gives you</p>
            <ul className="bullets">
              {persona.gains.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
            <p className="eyebrow">After a few months of practice</p>
            <p>{persona.afterPractice}</p>
          </div>
        </section>
        <section className="stack">
          <p className="eyebrow">Being wrong: production versus a kata</p>
          <table className="table cost-table">
            <thead>
              <tr>
                <th scope="col">
                  <span className="visually-hidden">Aspect</span>
                </th>
                <th scope="col">In production</th>
                <th scope="col">In a kata</th>
              </tr>
            </thead>
            <tbody>
              {costRows.map((row) => (
                <tr key={row.aspect}>
                  <th scope="row">{row.aspect}</th>
                  <td className="muted">{row.production}</td>
                  <td className="accent">{row.kata}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </PageShell>
  )
}
