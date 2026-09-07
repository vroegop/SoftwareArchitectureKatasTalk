import type { Adr } from '../types'

export const westhavenAdr: Adr = {
  title: 'ADR-001: Event-driven backbone between planning and real-time control',
  status: 'Accepted',
  date: '2026-03-12',
  context: [
    'The driving characteristics are availability, fault tolerance and performance; safety is a constraint on every decision.',
    'Planning and real-time control are two quanta with different needs: planning may be down for up to an hour, control may never stop while the yard is in motion and must dispatch in under a second.',
    'Three equipment vendors with different PLC protocols, and a fourth on the way, must be integrated without touching the dispatcher.',
    'Certification runs the exact production software against an emulated terminal, so the test setup must be a first-class deployment.',
    'The operator plans to sell the software to other terminals with different equipment and gate processes.',
  ],
  decision: [
    'Broker topology between the TOS core and the equipment control service: the TOS publishes job events, the ECS publishes move updates, other consumers subscribe.',
    'Service-based decomposition of the planning side into coarse domain services (vessel, yard, gate, integration) over one operational database.',
    'The equipment control service is its own quantum with a local state store and sub-second dispatch; it does not read the operational database on the hot path.',
    'Vendor PLC adapters are microkernel plug-ins inside the ECS behind one adapter contract; a new vendor is a new plug-in.',
    'The emulator implements the same adapter contract and stands in for the fleet in every test environment.',
  ],
  consequences: [
    'The planning view and the yard truth are eventually consistent; screens show the last known state with an age indicator.',
    'The broker cluster is on the critical path and must be highly available; a partition stalls dispatch until it heals.',
    'Testing the end-to-end flow needs the emulator plus event replay, which must be built early, not at the end.',
    'Operational complexity goes up: two runtimes, a broker and an emulator to run and monitor.',
    'Every event needs an owner, a schema and a versioning rule from day one.',
  ],
  alternatives: [
    {
      name: 'Microservices for everything',
      why: 'Rejected: a dispatch decision crossing several services and a bus adds latency and failure modes to a safety-critical loop, and one star on simplicity hurts certification.',
    },
    {
      name: 'Layered monolith',
      why: 'Rejected: one quantum and no fault isolation, so a planning bug or a slow report can stall the cranes.',
    },
    {
      name: 'Space-based architecture',
      why: 'Rejected: built for spiky user load with replicated caches, not for a deterministic control system, and one star on testability.',
    },
  ],
}
