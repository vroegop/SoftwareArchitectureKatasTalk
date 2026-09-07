import type { ArchitectureStyle } from '../types'
import { node, edge, colX, rowY } from '../diagram-helpers'

/* Four full-width layers stacked top to bottom, two notes underneath. */
const layerW = 880
const layerX = colX(0, 1, layerW)
const layerH = 80
const layerY = (row: number) => rowY(row, 100, 40)
const noteW = 400
const noteX = (i: number) => colX(i, 2, noteW, 1000, 60)
const noteY = 450

export const layered: ArchitectureStyle = {
  id: 'layered',
  name: 'Layered',
  family: 'monolithic',
  tagline: 'Technical layers in one deployment unit: simple, cheap, familiar.',
  description: [
    'The layered style groups code by technical role: presentation, business, persistence and database. Each layer only talks to the layer directly beneath it. That closed layering keeps changes local, as long as everyone respects it.',
    'Everything ships as a single deployment unit, usually with a separate relational database. Physically it can be split into two or three tiers, but the code stays one monolith.',
    'It is the default most teams fall into and the cheapest place to start. It is known for simplicity and low cost, and for struggling once the domain grows and change speeds up.',
  ],
  partitioning: 'technical',
  quanta: '1',
  // VERIFY against Fundamentals of Software Architecture 2nd ed., Chapter 10 · Layered Architecture Style
  ratings: {
    deployability: 1,
    elasticity: 1,
    evolutionary: 1,
    faultTolerance: 1,
    modularity: 1,
    overallCost: 5,
    performance: 2,
    reliability: 3,
    scalability: 1,
    simplicity: 5,
    testability: 2,
  },
  topology: {
    id: 'topology-layered',
    title: 'Layered architecture topology',
    level: 'topology',
    height: 540,
    nodes: [
      node('presentation', 'layer', 'Presentation layer', layerX, layerY(0), layerW, layerH, {
        tech: 'web UI, controllers',
        description: 'Handles user interaction and formatting',
      }),
      node('business', 'layer', 'Business layer', layerX, layerY(1), layerW, layerH, {
        tech: 'services, domain rules',
        description: 'Executes the business rules',
        emphasis: true,
      }),
      node('persistence', 'layer', 'Persistence layer', layerX, layerY(2), layerW, layerH, {
        tech: 'repositories, ORM',
        description: 'Maps objects to tables',
      }),
      node('database', 'layer', 'Database layer', layerX, layerY(3), layerW, layerH, {
        tech: 'relational database',
        description: 'Stores and retrieves the data',
      }),
      node('unit', 'note', 'One deployment unit', noteX(0), noteY, noteW, 60, {
        description: 'Layers separate code, not processes',
      }),
      node('closed', 'note', 'Closed layering', noteX(1), noteY, noteW, 60, {
        description: 'Each layer calls only the next one',
      }),
    ],
    edges: [
      edge('presentation', 'business', 'calls', 'in-process'),
      edge('business', 'persistence', 'calls', 'in-process'),
      edge('persistence', 'database', 'calls', 'SQL'),
    ],
    legend: [
      { kind: 'layer', label: 'Layer' },
      { kind: 'note', label: 'Note' },
    ],
  },
  whenToUse: [
    'Small applications or a first release with a tight budget and timeline.',
    'The team is small and already knows the layered model.',
    'You do not know the domain boundaries yet and want a cheap starting point.',
    'Simple CRUD-style workloads where operational characteristics are not critical.',
  ],
  whenToAvoid: [
    'Availability, fault tolerance or elasticity are driving characteristics.',
    'The system keeps growing and a change in one area regularly breaks another.',
    'You need frequent, low-risk deployments of independent parts.',
    'Domain changes cut across all layers, so every feature touches everything.',
  ],
  tradeoffs: {
    pro: [
      'Simple to understand, build and staff; every developer has seen it.',
      'Lowest overall cost of all the styles.',
      'A good fit when you are not yet sure which architecture you need.',
      'A natural first step that can later be carved into domain modules.',
    ],
    con: [
      'One deployment unit: a small change means redeploying and retesting everything.',
      'A failure anywhere brings the whole application down.',
      'Scales only by running more copies of the whole thing.',
      'Domain concepts are smeared across layers, so domain change is expensive.',
      'Layers invite pass-through code and sinkholes.',
    ],
  },
  pitfalls: [
    'Architecture sinkhole anti-pattern: requests pass through layers that add nothing.',
    'Layered by accident: the default nobody chose.',
    'Open layers everywhere: presentation reaching into persistence turns the layers into decoration.',
    'Big ball of mud: without enforced layer isolation the monolith slowly loses its structure.',
  ],
  examples: [
    'Classic web applications built with Spring MVC, ASP.NET or Rails.',
    'Internal line-of-business tools and admin back-offices.',
    'Small SaaS products in their first year.',
    'Legacy enterprise applications that grew out of a database-first design.',
  ],
  westhaven:
    'Westhaven as one layered application would put the TOS planning screens, the equipment dispatcher, the gate and the EDI integration into a single deployment with shared business and persistence layers over one database. It is the fastest way to a first demo and the worst way to run a 24/7 terminal: a bug in the EDI parser or a slow billing report can take the crane dispatcher down with it, and every safety-relevant change means redeploying and re-certifying the whole system. Fault tolerance and availability, the driving characteristics, score one star. Layering still has a place inside individual services, for example as the internal structure of the gate or billing component, but not as the top-level style for the terminal.',
  reference: { chapter: 'Chapter 10 · Layered Architecture Style' },
}
