import type { ArchitectureStyle } from '../types'
import { node, edge, colX, rowY } from '../diagram-helpers'

/* A core in the centre, three plug-ins above and three below, registry and data at the sides. */
const pluginW = 200
const pluginH = 70
const pluginX = (i: number) => colX(i, 3, pluginW, 1000, 60)
const pluginY = (row: number) => rowY(row, 350, 40)
const coreW = 400
const coreX = colX(0, 1, coreW)
const coreY = 200
const sideY = 215
const sideH = 70

export const microkernel: ArchitectureStyle = {
  id: 'microkernel',
  name: 'Microkernel',
  family: 'monolithic',
  tagline: 'A minimal core plus independent plug-ins that extend it.',
  description: [
    'The microkernel style has two parts: a core system and plug-in components. The core holds the minimal functionality needed to run at all; plug-ins add features, variations and customer or vendor specific behaviour. Plug-ins register with the core through a contract and do not know about each other.',
    'Most microkernel systems ship as a single deployment unit, with plug-ins as jar files, DLLs or packages loaded at start-up. Plug-ins can also run as remote services behind REST or messaging, which trades simplicity for fault isolation.',
    'It is the style behind IDEs, browsers, build servers and many product-based applications. It is known for extensibility and for keeping volatile, variant logic out of a stable core.',
  ],
  partitioning: 'technical & domain',
  quanta: '1',
  // VERIFY against Fundamentals of Software Architecture 2nd ed., Chapter 13 · Microkernel Architecture Style
  ratings: {
    deployability: 3,
    elasticity: 1,
    evolutionary: 3,
    faultTolerance: 1,
    modularity: 3,
    overallCost: 5,
    performance: 3,
    reliability: 3,
    scalability: 1,
    simplicity: 4,
    testability: 3,
  },
  topology: {
    id: 'topology-microkernel',
    title: 'Microkernel architecture topology',
    level: 'topology',
    height: 500,
    nodes: [
      node('core', 'core', 'Core system', coreX, coreY, coreW, 100, {
        tech: 'minimal runtime',
        description: 'Runs without any plug-in',
        emphasis: true,
      }),
      node('git', 'plugin', 'Git plug-in', pluginX(0), pluginY(0), pluginW, pluginH, {
        tech: 'in-process',
        description: 'Adds one feature',
      }),
      node('debugger', 'plugin', 'Debugger plug-in', pluginX(1), pluginY(0), pluginW, pluginH, {
        tech: 'in-process',
        description: 'Independent of other plug-ins',
      }),
      node('linter', 'plugin', 'Linter plug-in', pluginX(2), pluginY(0), pluginW, pluginH, {
        tech: 'in-process',
        description: 'Can be removed without harm',
      }),
      node('theme', 'plugin', 'Theme plug-in', pluginX(0), pluginY(1), pluginW, pluginH, {
        tech: 'in-process',
        description: 'Customer-specific variation',
      }),
      node('language', 'plugin', 'Language plug-in', pluginX(1), pluginY(1), pluginW, pluginH, {
        tech: 'in-process',
        description: 'Third-party extension',
      }),
      node('build', 'plugin', 'Build plug-in', pluginX(2), pluginY(1), pluginW, pluginH, {
        tech: 'remote, REST',
        description: 'Runs in its own process',
      }),
      node('data', 'database', 'Core data', 60, sideY, 180, sideH, {
        tech: 'shared database',
      }),
      node('registry', 'note', 'Plug-in registry', 760, sideY, 200, sideH, {
        description: 'Core knows plug-ins by contract only',
      }),
    ],
    edges: [
      edge('git', 'core', 'registers via contract', 'in-process', { direction: 'both' }),
      edge('debugger', 'core', 'registers via contract', 'in-process', { direction: 'both' }),
      edge('linter', 'core', 'registers via contract', 'in-process', { direction: 'both' }),
      edge('theme', 'core', 'registers via contract', 'in-process', { direction: 'both' }),
      edge('language', 'core', 'registers via contract', 'in-process', { direction: 'both' }),
      edge('build', 'core', 'registers via contract', 'REST', { direction: 'both', style: 'dashed' }),
      edge('core', 'data', 'reads, writes', 'SQL'),
    ],
    legend: [
      { kind: 'core', label: 'Core system' },
      { kind: 'plugin', label: 'Plug-in' },
      { kind: 'database', label: 'Database' },
      { kind: 'note', label: 'Note' },
    ],
  },
  whenToUse: [
    'The product has a stable core and many optional or customer-specific variations.',
    'Third parties, vendors or customers must extend the system without touching the core.',
    'Business rules change per region, contract or device type.',
    'You sell the same software to different customers with different feature sets.',
  ],
  whenToAvoid: [
    'There is no meaningful distinction between the core and its variations.',
    'Plug-ins would have to collaborate with each other to get work done.',
    'High scalability or elasticity are driving; the core is still one quantum.',
    'Fault tolerance is critical and plug-ins would run in-process with the core.',
  ],
  tradeoffs: {
    pro: [
      'Extensible: new behaviour is a new plug-in, not a change to the core.',
      'Isolating volatile logic keeps the core small and stable.',
      'Plug-ins can be tested in isolation against the contract.',
      'Works as a monolith and as a distributed system; cheap to start.',
    ],
    con: [
      'One quantum in the common in-process form; a bad plug-in can crash the core.',
      'Scalability and elasticity remain weak.',
      'Contract versioning between core and plug-ins needs discipline.',
      'Plug-in registries and dynamic loading add complexity that is easy to underestimate.',
    ],
  },
  pitfalls: [
    'Plug-ins that talk to each other directly: the star topology turns into a web.',
    'The core that knows too much: domain rules leak into the kernel and every change touches it.',
    'Contract drift: unversioned plug-in contracts break silently when the core changes.',
    'Plug-in explosion: hundreds of tiny plug-ins that nobody can find in the registry.',
  ],
  examples: [
    'Eclipse, VS Code and IntelliJ with their extension ecosystems.',
    'Jenkins and other build servers driven by plug-ins.',
    'Web browsers with extensions.',
    'Rule engines and claims or tax processing with per-jurisdiction rule plug-ins.',
  ],
  westhaven:
    'Inside the Westhaven equipment control service, microkernel is the natural shape: a small core dispatches jobs, manages traffic and enforces safety zones, while each crane and AGV vendor gets its own adapter plug-in behind one control contract. A new vendor or a firmware change means a new adapter, not a change to the certified core, and the emulator is simply another plug-in that speaks the same contract. The same idea suits the TOS for per-terminal rule packs once the operator sells the software elsewhere. What hurts is running vendor adapters in-process: a misbehaving adapter can take the dispatcher down, so at 24/7 the plug-ins for physical equipment want their own processes and the core needs a hot standby.',
  reference: { chapter: 'Chapter 13 · Microkernel Architecture Style' },
}
