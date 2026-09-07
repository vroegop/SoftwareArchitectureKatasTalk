import type { ArchitectureStyle } from '../types'
import { node, edge, colX, rowY } from '../diagram-helpers'

/* One boundary holding a UI, four domain modules and their own tables. */
const moduleW = 180
const moduleH = 80
const moduleX = (i: number) => colX(i, 4, moduleW, 1000, 80)
const uiW = 300
const uiX = colX(0, 1, uiW)
const uiY = rowY(0, 120, 70)
const moduleY = rowY(1, 100, 70)
const tablesY = rowY(2, 110, 70)
const noteW = 460
const noteX = colX(0, 1, noteW)

export const modularMonolith: ArchitectureStyle = {
  id: 'modular-monolith',
  name: 'Modular Monolith',
  family: 'monolithic',
  tagline: 'Domain modules with hard boundaries, shipped as one deployment unit.',
  description: [
    'A modular monolith is one deployment unit partitioned by domain rather than by technical layer. Orders, billing and customers live in separate modules, each with a public interface and private internals. Modules talk through those interfaces and never reach into the code or tables of another module.',
    'It is deployed like any monolith: one process, usually one database, with each module owning its own schema or group of tables. The boundaries are enforced with tooling such as ArchUnit or Spring Modulith, not by the network.',
    'It is known as the sensible default for teams that want domain structure without paying the distributed tax. It is also the most common stepping stone towards service-based and microservices architectures.',
  ],
  partitioning: 'domain',
  quanta: '1',
  // BEST GUESS, the 2nd edition added this style; verify
  // VERIFY against Fundamentals of Software Architecture 2nd ed., Chapter 11 · Modular Monolith Architecture Style
  ratings: {
    deployability: 2,
    elasticity: 1,
    evolutionary: 3,
    faultTolerance: 1,
    modularity: 4,
    overallCost: 5,
    performance: 3,
    reliability: 3,
    scalability: 1,
    simplicity: 4,
    testability: 3,
  },
  topology: {
    id: 'topology-modular-monolith',
    title: 'Modular monolith topology',
    level: 'topology',
    height: 500,
    nodes: [
      node('unit', 'boundary', 'Single deployment unit', 40, 40, 920, 340, {
        tech: 'one process, one database',
      }),
      node('ui', 'ui', 'Web UI', uiX, uiY, uiW, 60, {
        tech: 'React, MVC',
        description: 'Calls modules through their public APIs',
      }),
      node('catalogue', 'component', 'Catalogue', moduleX(0), moduleY, moduleW, moduleH, {
        tech: 'domain module',
        description: 'Products, prices, stock',
      }),
      node('orders', 'component', 'Orders', moduleX(1), moduleY, moduleW, moduleH, {
        tech: 'domain module',
        description: 'Baskets, orders, fulfilment',
        emphasis: true,
      }),
      node('billing', 'component', 'Billing', moduleX(2), moduleY, moduleW, moduleH, {
        tech: 'domain module',
        description: 'Invoices and payments',
      }),
      node('customers', 'component', 'Customers', moduleX(3), moduleY, moduleW, moduleH, {
        tech: 'domain module',
        description: 'Accounts and addresses',
      }),
      node('catalogue-tables', 'database', 'Own tables', moduleX(0), tablesY, moduleW, 60, {
        tech: 'catalogue schema',
      }),
      node('orders-tables', 'database', 'Own tables', moduleX(1), tablesY, moduleW, 60, {
        tech: 'orders schema',
      }),
      node('billing-tables', 'database', 'Own tables', moduleX(2), tablesY, moduleW, 60, {
        tech: 'billing schema',
      }),
      node('customers-tables', 'database', 'Own tables', moduleX(3), tablesY, moduleW, 60, {
        tech: 'customers schema',
      }),
      node('rule', 'note', 'Boundary rule', noteX, 410, noteW, 60, {
        description: 'No module reads the tables of another',
      }),
    ],
    edges: [
      edge('ui', 'catalogue', 'calls public API', 'in-process'),
      edge('ui', 'orders', 'calls public API', 'in-process'),
      edge('ui', 'billing', 'calls public API', 'in-process'),
      edge('ui', 'customers', 'calls public API', 'in-process'),
      edge('orders', 'catalogue', 'via interface', undefined, { style: 'dashed' }),
      edge('orders', 'billing', 'via interface', undefined, { style: 'dashed' }),
      edge('billing', 'customers', 'via interface', undefined, { style: 'dashed' }),
      edge('catalogue', 'catalogue-tables', 'owns'),
      edge('orders', 'orders-tables', 'owns'),
      edge('billing', 'billing-tables', 'owns'),
      edge('customers', 'customers-tables', 'owns'),
    ],
    legend: [
      { kind: 'boundary', label: 'Deployment unit' },
      { kind: 'ui', label: 'User interface' },
      { kind: 'component', label: 'Domain module' },
      { kind: 'database', label: 'Module-owned tables' },
      { kind: 'note', label: 'Note' },
    ],
  },
  whenToUse: [
    'The domain is reasonably well understood and you can name the bounded contexts.',
    'You want most of the modularity benefits without operating a distributed system.',
    'One team or a few teams share one codebase and one release train.',
    'You expect to extract services later and want the seams ready.',
  ],
  whenToAvoid: [
    'Parts of the system need independent scaling, elasticity or fault isolation.',
    'Modules need different runtimes, languages or release cadences.',
    'Nobody will enforce the boundaries; the modules will erode into a layered monolith.',
    'Availability requirements rule out a single point of failure.',
  ],
  tradeoffs: {
    pro: [
      'Domain partitioning: a feature change stays inside one module.',
      'In-process calls: no network latency and no distributed transactions.',
      'One deployment, one database, one place to debug; cheap to run.',
      'Clean seams make extracting services later realistic.',
    ],
    con: [
      'Still one quantum: one crash, one scaling unit, one deployment.',
      'Boundaries depend on discipline and tooling, not on physical separation.',
      'A shared database tempts modules into joining the tables of other modules.',
      'Deployment risk grows with the size of the codebase.',
    ],
  },
  pitfalls: [
    'Boundary erosion: modules querying the tables of another module or calling its internals directly.',
    'Layers in disguise: technical layers dressed up with domain folder names.',
    'Shared kernel sprawl: a common module that every module depends on and nobody owns.',
    'Entangled for good: modules so intertwined that extracting a service later is impossible.',
  ],
  examples: [
    'The Shopify core Rails application, a well-known modular monolith.',
    'E-commerce and ERP back-ends built with Spring Modulith or modular .NET projects.',
    'Product companies consolidating early microservices back into one codebase.',
    'A first release before the domain boundaries are proven in production.',
  ],
  westhaven:
    'For Westhaven, a modular monolith is a sensible first release for the planning side: vessel planning, yard planning, job generation, gate appointments and billing as domain modules in one TOS deployment, one database, one schema per module. Planning tolerates a few minutes of downtime, and in-process calls keep the planner fast and easy to test against the emulator. It does not fit the real-time equipment control: one quantum means a slow yard planning query and the crane dispatch loop share a process, and a failure in either stops the terminal. The safety-certified control loop and the vendor adapters need their own quanta, so the honest picture is a modular monolith for planning next to separately deployed control services.',
  reference: { chapter: 'Chapter 11 · Modular Monolith Architecture Style' },
}
