import type { ArchitectureStyle } from '../types'
import { node, edge } from '../diagram-helpers'

/* Broker topology: an initiating event fans out through channels and processors. */
export const eventDriven: ArchitectureStyle = {
  id: 'event-driven',
  name: 'Event-Driven',
  family: 'distributed',
  tagline: 'Decoupled processors reacting to events through channels.',
  description: [
    'Event-driven architecture is built from event processors that react to things that happened, published on channels, instead of services that call each other. A processor does its work, publishes what it did, and does not know or care who listens.',
    'The book describes two topologies. In the broker topology events flow through a lightweight broker and every processor picks up what it needs, which gives maximum decoupling. In the mediator topology a central mediator coordinates a workflow step by step, which gives control and error handling at the price of coupling.',
    'It is known for very high performance, scalability and fault tolerance, and for being hard to reason about: the workflow exists only as the sum of many small reactions.',
  ],
  partitioning: 'technical',
  quanta: '1 to many',
  // VERIFY against Fundamentals of Software Architecture 2nd ed., Chapter 15 · Event-Driven Architecture Style
  ratings: {
    deployability: 3,
    elasticity: 3,
    evolutionary: 5,
    faultTolerance: 5,
    modularity: 4,
    overallCost: 3,
    performance: 5,
    reliability: 3,
    scalability: 5,
    simplicity: 1,
    testability: 2,
  },
  topology: {
    id: 'topology-event-driven',
    title: 'Event-driven topology (broker)',
    level: 'topology',
    height: 480,
    nodes: [
      node('order', 'ui', 'Order placed', 30, 200, 150, 90, {
        tech: 'initiating event',
        description: 'Something happened',
      }),
      node('ch-order', 'queue', 'Order channel', 220, 210, 150, 70, { tech: 'topic' }),
      node('payment', 'service', 'Payment processor', 410, 195, 170, 100, {
        tech: 'event processor',
        description: 'Charges, then publishes',
      }),
      node('ch-paid', 'queue', 'Payment channel', 620, 210, 150, 70, { tech: 'topic' }),
      node('notify', 'service', 'Notification processor', 810, 50, 170, 90, {
        tech: 'event processor',
        description: 'Sends the confirmation',
      }),
      node('inventory', 'service', 'Inventory processor', 810, 200, 170, 90, {
        tech: 'event processor',
        description: 'Reserves the stock',
      }),
      node('shipping', 'service', 'Shipping processor', 810, 350, 170, 90, {
        tech: 'event processor',
        description: 'Books the carrier',
      }),
      node('note', 'note', 'Broker topology', 220, 380, 360, 70, {
        description: 'No mediator: each processor reacts on its own',
      }),
    ],
    edges: [
      edge('order', 'ch-order', 'publishes', 'async'),
      edge('ch-order', 'payment', 'delivers'),
      edge('payment', 'ch-paid', 'publishes', 'async'),
      edge('ch-paid', 'notify', 'delivers', undefined, { labelAt: 0.6 }),
      edge('ch-paid', 'inventory', 'delivers'),
      edge('ch-paid', 'shipping', 'delivers', undefined, { labelAt: 0.6 }),
    ],
    legend: [
      { kind: 'ui', label: 'Initiating event' },
      { kind: 'queue', label: 'Event channel' },
      { kind: 'service', label: 'Event processor' },
      { kind: 'note', label: 'Note' },
    ],
  },
  whenToUse: [
    'Fault tolerance, scalability or performance are driving characteristics.',
    'Work naturally decomposes into reactions to things that happened.',
    'Producers must keep going even when consumers are down or slow.',
    'You need to add new reactions later without touching existing processors.',
  ],
  whenToAvoid: [
    'The business demands a strict, auditable, step-by-step workflow with rollbacks.',
    'The team has never operated a broker or debugged asynchronous flows.',
    'Requests need an immediate, consistent answer rather than an eventual one.',
    'Simplicity and testability are driving characteristics.',
  ],
  tradeoffs: {
    pro: [
      'Five stars on performance, scalability, fault tolerance and evolvability.',
      'Processors are decoupled in time and in deployment.',
      'A broker buffers bursts, so producers rarely block.',
      'New behaviour is often a new subscriber, not a change to existing code.',
    ],
    con: [
      'One star on simplicity: the workflow is invisible until you trace the events.',
      'Testing needs the broker, replayed events and patience.',
      'Nondeterministic ordering and duplicate delivery must be designed for.',
      'Error handling is scattered: who retries, who compensates, who notices?',
    ],
  },
  pitfalls: [
    'Event storms and cycles: a processor reacting to its own consequences.',
    'Missing idempotency, so a redelivered event charges the customer twice.',
    'Events that carry commands in disguise, turning decoupling into hidden coupling.',
    'The broker as the unwatched single point of failure.',
  ],
  examples: [
    'Order and fulfilment pipelines in e-commerce.',
    'Financial transaction processing and fraud detection.',
    'Telemetry, monitoring and alerting platforms.',
    'Any system where "what happened" is more important than "who asked".',
  ],
  westhaven:
    'Event-driven is the backbone of the worked design: the planning side publishes job events, the equipment control service publishes move updates, and the gate, billing, telemetry and audit consumers all react without the control loop waiting for them. That is exactly the fault-tolerance and performance profile a 24/7 terminal needs, and adding a new consumer such as a customs hold checker does not touch the dispatcher. The costs are real: the broker cluster is on the critical path and must be highly available, ordering and idempotency must be designed in, and testing the full flow needs the emulator plus event replay. The broker topology fits because there is no single business workflow to orchestrate, only a stream of moves.',
  reference: { chapter: 'Chapter 15 · Event-Driven Architecture Style' },
}
