import type { SeedRisk } from '../types'

/** Demo stickies for the risk-storming page; target ids are nodes and edges of the C2 diagram. */
export const westhavenSeedRisks: SeedRisk[] = [
  { targetId: 'broker', probability: 3, impact: 3, note: 'Single broker cluster on the critical path; a partition stalls dispatch' },
  { targetId: 'ecs', probability: 2, impact: 3, note: 'Deadlock in the yard when two AGVs claim the same lane' },
  { targetId: 'adapters', probability: 3, impact: 2, note: 'Three PLC protocols today, a fourth tomorrow; vendor lock-in' },
  { targetId: 'adapters->fleet', probability: 2, impact: 3, note: 'Yard wireless partition leaves machines without commands' },
  { targetId: 'tos', probability: 2, impact: 2, note: 'Planning view and yard truth drift apart after a replay' },
  { targetId: 'emulator', probability: 2, impact: 2, note: 'Emulator fidelity: passes in test, surprises in the yard' },
  { targetId: 'gate', probability: 3, impact: 1, note: 'OCR misreads at the gate slow the truck queue' },
  { targetId: 'integration', probability: 1, impact: 1, note: 'Billing export delayed when the ERP is down' },
]
