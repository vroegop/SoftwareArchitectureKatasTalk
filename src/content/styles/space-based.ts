import type { ArchitectureStyle } from '../types'
import { node, edge, colX } from '../diagram-helpers'

/* Virtualised middleware over replicated processing units; the database sits behind data pumps. */
const unitW = 240
const unitX = (i: number) => colX(i, 3, unitW)
const pumpW = 180
const pumpX = (i: number) => colX(i, 3, pumpW)

export const spaceBased: ArchitectureStyle = {
  id: 'space-based',
  name: 'Space-Based',
  family: 'distributed',
  tagline: 'Replicated in-memory processing units, the database out of the hot path.',
  description: [
    'Space-based architecture attacks the two bottlenecks of high-load systems: the web server pool and the central database. Application code runs in processing units that each hold a replicated in-memory data grid, so a request is served entirely from memory without touching the database.',
    'Virtualised middleware ties it together: a messaging grid routes requests, a data grid keeps the replicated caches in sync, a processing grid coordinates work across units and a deployment manager starts and stops units as load changes. Data pumps write changes to the database asynchronously and load it back when units start.',
    'It is known for extreme elasticity, scalability and performance, and for being complex, expensive and hard to test at realistic scale.',
  ],
  partitioning: 'technical & domain',
  quanta: '1 to many',
  // VERIFY against Fundamentals of Software Architecture 2nd ed., Chapter 16 · Space-Based Architecture Style
  ratings: {
    deployability: 3,
    elasticity: 5,
    evolutionary: 3,
    faultTolerance: 3,
    modularity: 3,
    overallCost: 2,
    performance: 5,
    reliability: 4,
    scalability: 5,
    simplicity: 1,
    testability: 1,
  },
  topology: {
    id: 'topology-space-based',
    title: 'Space-based topology',
    level: 'topology',
    height: 560,
    nodes: [
      node('middleware', 'gateway', 'Virtualised middleware', 60, 30, 880, 90, {
        tech: 'messaging grid, data grid, processing grid, deployment manager',
        description: 'Routes requests, syncs caches, starts units',
      }),
      node('unit-1', 'space', 'Processing unit', unitX(0), 180, unitW, 120, {
        tech: 'app + in-memory data grid',
        description: 'Serves requests from memory',
      }),
      node('unit-2', 'space', 'Processing unit', unitX(1), 180, unitW, 120, {
        tech: 'app + in-memory data grid',
        description: 'Replicated copy',
      }),
      node('unit-3', 'space', 'Processing unit', unitX(2), 180, unitW, 120, {
        tech: 'app + in-memory data grid',
        description: 'Started on demand',
      }),
      node('pump-1', 'component', 'Data pump', pumpX(0), 360, pumpW, 60, { tech: 'async' }),
      node('pump-2', 'component', 'Data pump', pumpX(1), 360, pumpW, 60, { tech: 'async' }),
      node('pump-3', 'component', 'Data pump', pumpX(2), 360, pumpW, 60, { tech: 'async' }),
      node('db', 'database', 'Database', 350, 470, 300, 70, {
        tech: 'out of the hot path',
      }),
    ],
    edges: [
      edge('middleware', 'unit-1', 'routes requests', undefined, { labelAt: 0.4 }),
      edge('middleware', 'unit-2', 'routes requests', undefined, { labelAt: 0.6 }),
      edge('middleware', 'unit-3', 'routes requests', undefined, { labelAt: 0.4 }),
      edge('unit-1', 'unit-2', 'replicates', 'data grid', { direction: 'both', style: 'dashed' }),
      edge('unit-2', 'unit-3', 'replicates', 'data grid', { direction: 'both', style: 'dashed' }),
      edge('unit-1', 'pump-1', 'writes changes', 'async', { style: 'dashed' }),
      edge('unit-2', 'pump-2', 'writes changes', 'async', { style: 'dashed' }),
      edge('unit-3', 'pump-3', 'writes changes', 'async', { style: 'dashed' }),
      edge('pump-1', 'db', 'persists', undefined, { style: 'dashed', labelAt: 0.4 }),
      edge('pump-2', 'db', 'persists', undefined, { style: 'dashed', labelAt: 0.6 }),
      edge('pump-3', 'db', 'persists', undefined, { style: 'dashed', labelAt: 0.4 }),
    ],
    legend: [
      { kind: 'gateway', label: 'Virtualised middleware' },
      { kind: 'space', label: 'Processing unit' },
      { kind: 'component', label: 'Data pump' },
      { kind: 'database', label: 'Database' },
    ],
  },
  whenToUse: [
    'Unpredictable, spiky user load such as ticket sales or flash auctions.',
    'Elasticity, scalability and performance are the top three characteristics.',
    'Reads dominate and the working set fits in memory.',
    'You can afford the operational skill and the infrastructure.',
  ],
  whenToAvoid: [
    'Data must be strongly consistent at every moment.',
    'The working set is large, volatile or must be archived immediately.',
    'The team cannot test at production-like scale.',
    'Cost or simplicity are driving characteristics.',
  ],
  tradeoffs: {
    pro: [
      'Five stars on elasticity, scalability and performance.',
      'The database is no longer the bottleneck for the hot path.',
      'Units can be started and stopped as load changes.',
      'Good reliability once the grids are tuned.',
    ],
    con: [
      'One star on simplicity and on testability.',
      'Cache synchronisation is the hard problem, and it is yours.',
      'Expensive in infrastructure and in the people who understand it.',
      'Data collisions between units under high write rates.',
    ],
  },
  pitfalls: [
    'Data collisions: two units updating the same item before replication catches up.',
    'Assuming the cache is the truth when the database disagrees after a restart.',
    'Testing only at small scale, so the first real spike is also the first real test.',
    'Using it for a write-heavy system where replication traffic dwarfs the work.',
  ],
  examples: [
    'Concert and event ticketing at the moment sales open.',
    'Online auction bidding and betting platforms.',
    'Real-time trading front ends.',
    'Retail flash sales and seasonal peaks.',
  ],
  westhaven:
    'Space-based looks tempting for Westhaven at first sight: five stars on performance and elasticity. It solves the wrong problem. The terminal has a large but predictable load, a deterministic control loop and a hard requirement that the equipment control service knows the true position of every machine. Replicated in-memory copies with asynchronous synchronisation are the opposite of that, and one star on testability is unacceptable for software that must be certified against collisions. The style was considered and rejected on the decision page; the one place its ideas resurface is the in-memory state store inside the equipment control service, which is a single copy, not a grid.',
  reference: { chapter: 'Chapter 16 · Space-Based Architecture Style' },
}
