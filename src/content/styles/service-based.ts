import type { ArchitectureStyle } from '../types'
import { node, edge, colX } from '../diagram-helpers'

/* One user interface, a row of coarse-grained domain services, one shared database. */
const serviceW = 190
const serviceX = (i: number) => colX(i, 4, serviceW)

export const serviceBased: ArchitectureStyle = {
  id: 'service-based',
  name: 'Service-Based',
  family: 'distributed',
  tagline: 'A few coarse-grained domain services over one shared database.',
  description: [
    'Service-based architecture is the pragmatic middle ground of the distributed styles. A user interface talks to a handful of coarse-grained domain services, typically four to twelve, each a separately deployed application that owns a business area such as orders, inventory or billing.',
    'The services usually share one monolithic database, which keeps transactions simple and avoids the data-decomposition work that microservices demand. Services do not normally call each other; the user interface or an API layer stitches the flow together.',
    'It is known as the style teams reach for when a monolith has grown painful but a full microservices programme would be overkill: better deployability and fault tolerance for a modest price.',
  ],
  partitioning: 'domain',
  quanta: '1 to many',
  // VERIFY against Fundamentals of Software Architecture 2nd ed., Chapter 14 · Service-Based Architecture Style
  ratings: {
    deployability: 4,
    elasticity: 2,
    evolutionary: 3,
    faultTolerance: 4,
    modularity: 4,
    overallCost: 4,
    performance: 3,
    reliability: 4,
    scalability: 3,
    simplicity: 3,
    testability: 4,
  },
  topology: {
    id: 'topology-service-based',
    title: 'Service-based topology',
    level: 'topology',
    height: 480,
    nodes: [
      node('ui', 'ui', 'User interface', 60, 30, 880, 70, {
        tech: 'web application',
        description: 'One interface, all domain services',
      }),
      node('orders', 'service', 'Orders', serviceX(0), 170, serviceW, 110, {
        tech: 'domain service',
        description: 'Coarse-grained, separately deployed',
      }),
      node('inventory', 'service', 'Inventory', serviceX(1), 170, serviceW, 110, {
        tech: 'domain service',
        description: 'Owns stock and warehouses',
      }),
      node('billing', 'service', 'Billing', serviceX(2), 170, serviceW, 110, {
        tech: 'domain service',
        description: 'Invoices and payments',
      }),
      node('reporting', 'service', 'Reporting', serviceX(3), 170, serviceW, 110, {
        tech: 'domain service',
        description: 'Dashboards and exports',
      }),
      node('db', 'database', 'Shared database', 250, 360, 500, 90, {
        tech: 'relational',
        description: 'One schema shared by every service',
      }),
    ],
    edges: [
      edge('ui', 'orders', 'calls', 'REST', { labelAt: 0.35 }),
      edge('ui', 'inventory', 'calls', 'REST', { labelAt: 0.55 }),
      edge('ui', 'billing', 'calls', 'REST', { labelAt: 0.55 }),
      edge('ui', 'reporting', 'calls', 'REST', { labelAt: 0.35 }),
      edge('orders', 'db', 'reads and writes', 'SQL', { labelAt: 0.35 }),
      edge('inventory', 'db', 'reads and writes', 'SQL', { labelAt: 0.6 }),
      edge('billing', 'db', 'reads and writes', 'SQL', { labelAt: 0.6 }),
      edge('reporting', 'db', 'reads', 'SQL', { labelAt: 0.35 }),
    ],
    legend: [
      { kind: 'ui', label: 'User interface' },
      { kind: 'service', label: 'Domain service' },
      { kind: 'database', label: 'Shared database' },
    ],
  },
  whenToUse: [
    'A monolith has grown painful and you want deployability without a data-splitting programme.',
    'Business-facing applications with clear domain areas and modest scaling needs.',
    'Teams that want fault isolation between domains but one transactional database.',
    'A stepping stone from monolith to finer-grained services, if you ever need them.',
  ],
  whenToAvoid: [
    'Elasticity is a driving characteristic and load spikes hit one small function.',
    'Domains need different data models, storage engines or retention rules.',
    'Services would need to call each other constantly to get anything done.',
    'Regulations force strict data ownership per team.',
  ],
  tradeoffs: {
    pro: [
      'Four stars on deployability, fault tolerance, testability and reliability at four stars of cost.',
      'Domain partitioning gives teams clear ownership.',
      'ACID transactions still work because the database is shared.',
      'Far fewer moving parts than microservices.',
    ],
    con: [
      'The shared database is a coupling point: schema changes ripple across services.',
      'Scaling is per coarse service, so a hot spot scales more than it needs to.',
      'Two stars on elasticity; sudden bursts are not its strength.',
      'Services that start calling each other slide towards a distributed monolith.',
    ],
  },
  pitfalls: [
    'The database becomes the integration bus: one table change, four deployments.',
    'Too many services: below the coarse-grained sweet spot you inherit microservices problems without the benefits.',
    'A single shared library of entities that every service imports, so nothing can change alone.',
    'Reporting queries that lock the operational tables.',
  ],
  examples: [
    'Order management and back-office platforms for retailers.',
    'Insurance and banking line-of-business applications.',
    'SaaS products that outgrew a Rails or .NET monolith.',
    'Internal platforms with a handful of teams and one database team.',
  ],
  westhaven:
    'Service-based decomposition fits the planning side of Westhaven well: a vessel service, a yard service, a gate service and an integration service, each deployed on its own and owned by one team, sharing the operational database. That gives four stars on deployability and fault tolerance for the parts that may be down for an hour. It does not fit the real-time control loop: the equipment control service needs its own state and sub-second dispatch, so it lives outside the shared database as a separate quantum, and the seam between the two is the event backbone rather than a shared table. The cost is eventual consistency between the planning view and the yard truth, which the debrief should name.',
  reference: { chapter: 'Chapter 14 · Service-Based Architecture Style' },
}
