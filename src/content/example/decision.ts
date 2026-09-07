import type { StyleId } from '../types'
import type { CharacteristicPick, StyleShortlistEntry } from '../widgets'

/** Driving characteristics for the same product in three different contexts. */
export const westhavenPicks: CharacteristicPick[] = [
  {
    contextId: 'terminal',
    contextLabel: 'Westhaven as described',
    contextDescription: 'A 24/7 terminal, safety certified, three vendors, one shot at go-live.',
    top3: ['faultTolerance', 'performance', 'reliability'],
    rationale:
      'The customer says availability; in the book’s rating vocabulary that shows up as fault tolerance plus reliability, with performance third because a crane waiting for a decision costs money every second. Next in line are extensibility (vendor plug-ins) and testability (the emulator). Safety is a cross-cutting constraint that no star captures, so it vetoes options rather than ranking them.',
  },
  {
    contextId: 'startup',
    contextLabel: 'Same product, bootstrapped start-up',
    contextDescription: 'Two developers, one pilot terminal, a year of runway.',
    top3: ['overallCost', 'simplicity', 'deployability'],
    rationale:
      'With two developers and a pilot terminal, cost and simplicity dominate: a modular monolith for planning plus one small separate control service, deployed often, is the least worst option. The characteristics changed, so the architecture changes, even though the domain did not.',
  },
  {
    contextId: 'multi-terminal',
    contextLabel: 'Five terminals in three countries',
    contextDescription: 'The product succeeded and is being sold to other operators.',
    top3: ['evolutionary', 'modularity', 'deployability'],
    rationale:
      'Selling to other terminals makes evolvability, modularity and deployability the drivers: every terminal has different equipment, gates and customs rules, so the parts that vary must be swappable and releasable on their own.',
  },
]

/** Every style, with the verdict the worked design reached. */
export const westhavenShortlist: StyleShortlistEntry[] = [
  { styleId: 'event-driven', verdict: 'chosen', reason: 'Five stars on fault tolerance and performance; moves and equipment states are events by nature.' },
  { styleId: 'service-based', verdict: 'chosen', reason: 'Coarse domain services with clear ownership for the planning side; pragmatic and cheap.' },
  { styleId: 'microkernel', verdict: 'chosen', reason: 'Vendor PLC adapters as plug-ins inside the equipment control service.' },
  { styleId: 'microservices', verdict: 'considered', reason: 'Five stars on deployability and scalability, but two on performance and one on simplicity: too many quanta in the control loop.' },
  { styleId: 'space-based', verdict: 'considered', reason: 'Elasticity and performance, but one star on testability and replicated caches fight a deterministic control system.' },
  { styleId: 'modular-monolith', verdict: 'rejected', reason: 'Not as the backbone; a sensible first release of the planning side alone.' },
  { styleId: 'layered', verdict: 'rejected', reason: 'One quantum, no fault isolation: a slow report could stall the cranes.' },
  { styleId: 'pipeline', verdict: 'rejected', reason: 'Fits the EDI import pipeline only, not the terminal.' },
  { styleId: 'orchestration-soa', verdict: 'rejected', reason: 'A central orchestration engine in the control path is the distributed monolith trap.' },
]

export const westhavenChosenStyles: StyleId[] = ['event-driven', 'service-based', 'microkernel']

export interface QuantumDef {
  name: string
  needs: string
  contains: string[]
  /** Node ids in the C2 diagram, for highlighting. */
  nodeIds: string[]
}

export const westhavenQuanta: QuantumDef[] = [
  {
    name: 'Planning quantum',
    needs: 'Seconds of latency are fine; may be down for an hour',
    contains: ['Planning web app', 'TOS core', 'Operational DB', 'Integration gateway', 'Gate kiosk & OCR gateway'],
    nodeIds: ['planning-app', 'tos', 'opdb', 'integration', 'gate'],
  },
  {
    name: 'Real-time control quantum',
    needs: 'Sub-second dispatch; never down while the yard moves',
    contains: ['Equipment control service', 'Vendor PLC adapters', 'Remote operator station', 'Telemetry store'],
    nodeIds: ['ecs', 'adapters', 'operator-station', 'telemetry'],
  },
  {
    name: 'The seam',
    needs: 'A highly available cluster with replayable events',
    contains: ['Message broker'],
    nodeIds: ['broker'],
  },
]

/** Deliberately undecided, in the spirit of the second law: why before how. */
export const westhavenUndecided: string[] = [
  'The broker product: Kafka is written on the diagram as a placeholder for "a durable, replayable log", not as a decision.',
  'Whether the planning services get their own databases later; today one operational database keeps transactions simple.',
  'Whether the gate becomes its own quantum once trucks arrive around the clock.',
  'Cloud or on-premise for the planning side; the control side stays in the terminal regardless.',
]
