import type { ArchitectureStyle } from '../types'
import { node, edge, colX } from '../diagram-helpers'

/* Business services on top, an orchestration engine in the middle, taxonomies of services below. */
const bizW = 300
const bizX = (i: number) => colX(i, 2, bizW, 1000, 120)
const entW = 220
const entX = (i: number) => colX(i, 3, entW)
const lowW = 200
const lowX = (i: number) => colX(i, 4, lowW)

export const orchestrationSoa: ArchitectureStyle = {
  id: 'orchestration-soa',
  name: 'Orchestration-Driven SOA',
  family: 'distributed',
  tagline: 'Reuse-driven service layers glued together by a central orchestration engine.',
  description: [
    'Orchestration-driven service-oriented architecture was the enterprise answer of the early 2000s: build every capability once, as a service, and compose business processes out of them. Services are sorted into taxonomies: business services that name a process, enterprise services that implement shared capabilities, application services for one-off needs and infrastructure services for logging, auditing and security.',
    'An orchestration engine, usually an enterprise service bus, sits in the middle. It routes messages, transforms formats, and coordinates every business process across the layers, so it knows about everything.',
    'It is known for maximising reuse and for the price of that reuse: coupling so tight that a change to a shared service needs coordination across the whole company. The book treats it mainly as a lesson in how reuse-first thinking goes wrong.',
  ],
  partitioning: 'technical',
  quanta: '1',
  // VERIFY against Fundamentals of Software Architecture 2nd ed., Chapter 17 · Orchestration-Driven Service-Oriented Architecture
  ratings: {
    deployability: 1,
    elasticity: 3,
    evolutionary: 1,
    faultTolerance: 3,
    modularity: 3,
    overallCost: 1,
    performance: 2,
    reliability: 2,
    scalability: 3,
    simplicity: 1,
    testability: 1,
  },
  topology: {
    id: 'topology-orchestration-soa',
    title: 'Orchestration-driven SOA topology',
    level: 'topology',
    height: 560,
    nodes: [
      node('biz-1', 'service', 'Business service', bizX(0), 30, bizW, 80, {
        tech: 'process',
        description: 'Place order',
      }),
      node('biz-2', 'service', 'Business service', bizX(1), 30, bizW, 80, {
        tech: 'process',
        description: 'Onboard customer',
      }),
      node('esb', 'gateway', 'Orchestration engine', 150, 190, 700, 90, {
        tech: 'enterprise service bus',
        description: 'Routes, transforms and orchestrates every process',
      }),
      node('ent-1', 'service', 'Enterprise service', entX(0), 340, entW, 80, {
        tech: 'shared capability',
        description: 'Create quote',
      }),
      node('ent-2', 'service', 'Enterprise service', entX(1), 340, entW, 80, {
        tech: 'shared capability',
        description: 'Check credit',
      }),
      node('ent-3', 'service', 'Enterprise service', entX(2), 340, entW, 80, {
        tech: 'shared capability',
        description: 'Fulfil order',
      }),
      node('app-1', 'service', 'Application service', lowX(0), 470, lowW, 70, {
        tech: 'one-off',
      }),
      node('app-2', 'service', 'Application service', lowX(1), 470, lowW, 70, {
        tech: 'one-off',
      }),
      node('infra-1', 'service', 'Infrastructure service', lowX(2), 470, lowW, 70, {
        tech: 'auth, logging',
      }),
      node('infra-2', 'service', 'Infrastructure service', lowX(3), 470, lowW, 70, {
        tech: 'audit, monitoring',
      }),
    ],
    edges: [
      edge('biz-1', 'esb', 'invokes', undefined, { labelAt: 0.45 }),
      edge('biz-2', 'esb', 'invokes', undefined, { labelAt: 0.45 }),
      edge('esb', 'ent-1', 'orchestrates', undefined, { labelAt: 0.55 }),
      edge('esb', 'ent-2', 'orchestrates', undefined, { labelAt: 0.4 }),
      edge('esb', 'ent-3', 'orchestrates', undefined, { labelAt: 0.55 }),
      edge('esb', 'app-1', 'calls', undefined, { labelAt: 0.3 }),
      edge('esb', 'app-2', 'calls', undefined, { labelAt: 0.75 }),
      edge('esb', 'infra-1', 'calls', undefined, { labelAt: 0.75 }),
      edge('esb', 'infra-2', 'calls', undefined, { labelAt: 0.3 }),
    ],
    legend: [
      { kind: 'service', label: 'Service (by taxonomy)' },
      { kind: 'gateway', label: 'Orchestration engine' },
    ],
  },
  whenToUse: [
    'Honestly: almost never for new systems.',
    'A large enterprise standardising integration across many legacy systems.',
    'When a central team must govern every process end to end.',
    'As a lesson in why reuse-first architecture couples everything.',
  ],
  whenToAvoid: [
    'Deployability, evolvability or simplicity matter at all.',
    'Teams need to change their services without company-wide coordination.',
    'Latency-sensitive paths, because every hop crosses the bus.',
    'You are tempted by the promise that shared services mean less work.',
  ],
  tradeoffs: {
    pro: [
      'Maximises reuse of enterprise capabilities.',
      'One place to see, route and transform every process.',
      'Central governance suits heavily regulated organisations.',
      'Scalability and elasticity are acceptable because services are distributed.',
    ],
    con: [
      'One star on deployability, evolvability, simplicity, testability and cost.',
      'Reuse becomes coupling: change one shared service, retest everyone.',
      'The bus is a performance bottleneck and a single point of failure.',
      'Transactions across services are hard, so processes leak business logic into the bus.',
    ],
  },
  pitfalls: [
    'The distributed monolith: many services, one deployment in practice.',
    'Reuse-driven coupling: one shared customer service with fifty callers and no room to change.',
    'Business logic migrating into the orchestration engine where nobody tests it.',
    'The ESB as the unwatched bottleneck of the whole company.',
  ],
  examples: [
    'Early 2000s enterprise integration programmes in banks and insurers.',
    'Vendor ESB suites tying ERP, CRM and billing together.',
    'Government platforms built around a central integration layer.',
    'Legacy systems that microservices programmes are still replacing.',
  ],
  westhaven:
    'Westhaven in orchestration-driven SOA would put an enterprise service bus between every part of the terminal, with a central engine orchestrating each container move as a process: gate check, yard slot, crane job, customs, billing. Every move would cross the bus several times, the engine would hold safety-relevant logic where it is hardest to test, and any change to a shared service such as "container lookup" would require a terminal-wide retest. That is the distributed monolith trap on a system that cannot stop. It was rejected on the decision page in one line: no central orchestration engine in the control path.',
  reference: { chapter: 'Chapter 17 · Orchestration-Driven Service-Oriented Architecture' },
}
