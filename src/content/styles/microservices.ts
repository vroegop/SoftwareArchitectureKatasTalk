import type { ArchitectureStyle } from '../types'
import { node, edge, colX } from '../diagram-helpers'

/* Client apps, an API layer, single-purpose services each owning their data, an event bus for async flows. */
const svcW = 190
const svcX = (i: number) => colX(i, 4, svcW)

export const microservices: ArchitectureStyle = {
  id: 'microservices',
  name: 'Microservices',
  family: 'distributed',
  tagline: 'Many small, independently deployable services, each owning its data.',
  description: [
    'Microservices take domain partitioning to its logical end: each service captures one bounded context, runs in its own process, owns its own data store and deploys on its own. Nothing is shared, so nothing has to be coordinated, in theory.',
    'An API layer or gateway fronts the services; user interfaces are either one front end calling many services or a micro-frontend per service. Services talk synchronously through REST or gRPC when they must, and asynchronously through events when they can. Cross-service transactions become sagas with compensation.',
    'It is known for the highest scores on deployability, scalability, elasticity and evolvability, and for the cost: distributed complexity, network latency, data consistency problems and an operations bill to match.',
  ],
  partitioning: 'domain',
  quanta: '1 to many',
  // VERIFY against Fundamentals of Software Architecture 2nd ed., Chapter 18 · Microservices Architecture
  ratings: {
    deployability: 5,
    elasticity: 5,
    evolutionary: 5,
    faultTolerance: 4,
    modularity: 5,
    overallCost: 1,
    performance: 2,
    reliability: 4,
    scalability: 5,
    simplicity: 1,
    testability: 4,
  },
  topology: {
    id: 'topology-microservices',
    title: 'Microservices topology',
    level: 'topology',
    height: 600,
    nodes: [
      node('clients', 'ui', 'Client apps', 60, 30, 880, 60, { tech: 'web, mobile' }),
      node('api', 'gateway', 'API layer', 200, 130, 600, 70, {
        tech: 'gateway',
        description: 'Routing, auth, discovery',
      }),
      node('orders', 'service', 'Orders', svcX(0), 250, svcW, 100, {
        tech: 'own runtime',
        description: 'One bounded context',
      }),
      node('payments', 'service', 'Payments', svcX(1), 250, svcW, 100, {
        tech: 'own runtime',
        description: 'Independently deployed',
      }),
      node('inventory', 'service', 'Inventory', svcX(2), 250, svcW, 100, {
        tech: 'own runtime',
        description: 'Scales on its own',
      }),
      node('notify', 'service', 'Notifications', svcX(3), 250, svcW, 100, {
        tech: 'own runtime',
        description: 'Reacts to events',
      }),
      node('orders-db', 'database', 'Orders data', svcX(0), 390, svcW, 70, { tech: 'owned' }),
      node('payments-db', 'database', 'Payments data', svcX(1), 390, svcW, 70, { tech: 'owned' }),
      node('inventory-db', 'database', 'Inventory data', svcX(2), 390, svcW, 70, { tech: 'owned' }),
      node('notify-db', 'database', 'Notification data', svcX(3), 390, svcW, 70, { tech: 'owned' }),
      node('bus', 'queue', 'Event bus', 250, 510, 500, 60, { tech: 'async events' }),
    ],
    edges: [
      edge('clients', 'api', 'calls', 'HTTPS'),
      edge('api', 'orders', 'routes', 'REST', { labelAt: 0.4 }),
      edge('api', 'payments', 'routes', 'REST', { labelAt: 0.6 }),
      edge('api', 'inventory', 'routes', 'REST', { labelAt: 0.6 }),
      edge('api', 'notify', 'routes', 'REST', { labelAt: 0.4 }),
      edge('orders', 'orders-db', 'owns'),
      edge('payments', 'payments-db', 'owns'),
      edge('inventory', 'inventory-db', 'owns'),
      edge('notify', 'notify-db', 'owns'),
      edge('orders-db', 'bus', 'order placed', 'event', {
        style: 'dashed',
        via: [{ x: 115, y: 540 }],
        labelAt: 0.5,
      }),
      edge('bus', 'notify-db', 'order placed', 'event', {
        style: 'dashed',
        via: [{ x: 885, y: 540 }],
        labelAt: 0.5,
      }),
    ],
    legend: [
      { kind: 'ui', label: 'Client apps' },
      { kind: 'gateway', label: 'API layer' },
      { kind: 'service', label: 'Microservice' },
      { kind: 'database', label: 'Owned data store' },
      { kind: 'queue', label: 'Event bus' },
    ],
  },
  whenToUse: [
    'Deployability, elasticity and evolvability are the driving characteristics.',
    'Many teams need to release independently at high frequency.',
    'Bounded contexts are clear and rarely need each other synchronously.',
    'The organisation can pay for platform, observability and on-call.',
  ],
  whenToAvoid: [
    'Performance or simplicity are driving characteristics.',
    'The domain is not understood well enough to draw boundaries.',
    'One small team, one product, one database: you will build a distributed monolith.',
    'Workflows need transactions across many services.',
  ],
  tradeoffs: {
    pro: [
      'Five stars on deployability, scalability, elasticity, evolvability and modularity.',
      'Teams own a service end to end, including its data.',
      'A failure stays inside one small service if the rest is designed for it.',
      'Technology choices can differ per service where that pays off.',
    ],
    con: [
      'One star on cost and on simplicity.',
      'Two stars on performance: every business flow crosses the network.',
      'Data consistency becomes sagas, compensation and eventual consistency.',
      'Needs serious platform engineering: discovery, tracing, deployment pipelines.',
    ],
  },
  pitfalls: [
    'Grains of sand: services so small that every feature touches ten of them.',
    'The shared database that turns independent services into one deployment.',
    'Chatty synchronous calls, so latency and failure modes multiply.',
    'Distributed transactions without sagas, or sagas without compensation.',
  ],
  examples: [
    'Large consumer platforms with hundreds of teams.',
    'Streaming and retail companies that popularised the style.',
    'Cloud-native SaaS products built for independent team delivery.',
    'Any system that must scale one function far beyond the rest.',
  ],
  westhaven:
    'Microservices for all of Westhaven would give every capability its own service and data store: vessel planning, yard planning, dispatching, traffic management, safety, gate, customs, billing. On paper it scores five stars on deployability and scalability. In the control loop it fails the two drivers that matter: a dispatch decision that crosses four services and a bus before a crane moves is too slow and has too many failure modes for a safety-certified system, and one star on simplicity is a poor trade for software that must be reasoned about in an audit. The decision page rejects it as the backbone and keeps the idea where it fits: the gate, the integration gateway and billing can be small independent services with their own data.',
  reference: { chapter: 'Chapter 18 · Microservices Architecture' },
}
