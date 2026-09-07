import type { Characteristic, CharacteristicId } from './types'

/**
 * The eleven characteristics that Fundamentals of Software Architecture rates
 * per style (plus partitioning type and number of quanta, which are not stars).
 */
export const characteristics: Characteristic[] = [
  {
    id: 'deployability',
    label: 'Deployability',
    short: 'Deploy',
    group: 'structural',
    description: 'How easily and how often you can release: ceremony, risk and blast radius of a deployment.',
  },
  {
    id: 'elasticity',
    label: 'Elasticity',
    short: 'Elastic',
    group: 'operational',
    description: 'Ability to handle sudden bursts of load by scaling out quickly, and back in afterwards.',
  },
  {
    id: 'evolutionary',
    label: 'Evolutionary',
    short: 'Evolve',
    group: 'structural',
    description: 'How well the architecture supports change over time without a rewrite.',
  },
  {
    id: 'faultTolerance',
    label: 'Fault tolerance',
    short: 'Faults',
    group: 'operational',
    description: 'Whether one part failing takes the rest down with it.',
  },
  {
    id: 'modularity',
    label: 'Modularity',
    short: 'Modular',
    group: 'structural',
    description: 'Degree of separation into well-bounded parts with low coupling.',
  },
  {
    id: 'overallCost',
    label: 'Overall cost',
    short: 'Cost',
    group: 'cross-cutting',
    description: 'Total cost to build and run: more stars means cheaper.',
  },
  {
    id: 'performance',
    label: 'Performance',
    short: 'Perf',
    group: 'operational',
    description: 'Responsiveness and throughput for a single request or flow.',
  },
  {
    id: 'reliability',
    label: 'Reliability',
    short: 'Reliable',
    group: 'operational',
    description: 'Consistency of correct behaviour, including under partial failure.',
  },
  {
    id: 'scalability',
    label: 'Scalability',
    short: 'Scale',
    group: 'operational',
    description: 'Ability to keep performance as the number of users or requests grows.',
  },
  {
    id: 'simplicity',
    label: 'Simplicity',
    short: 'Simple',
    group: 'structural',
    description: 'How easy the whole is to understand, build and operate.',
  },
  {
    id: 'testability',
    label: 'Testability',
    short: 'Test',
    group: 'structural',
    description: 'Ease and completeness of testing, including how much you can test in isolation.',
  },
]

export const characteristicById = Object.fromEntries(
  characteristics.map((c) => [c.id, c]),
) as Record<CharacteristicId, Characteristic>

export const CHARACTERISTIC_GROUP_LABELS = {
  operational: 'Operational',
  structural: 'Structural',
  'cross-cutting': 'Cross-cutting',
} as const
