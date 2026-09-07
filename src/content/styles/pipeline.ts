import type { ArchitectureStyle } from '../types'
import { node, edge, colX, rowY } from '../diagram-helpers'

/* Main flow left to right on the top row, a branch off the tester on the second row. */
const filterW = 180
const filterH = 80
const filterX = (i: number) => colX(i, 4, filterW, 1000, 40)
const filterY = (row: number) => rowY(row, 160, 60)
const noteW = 460
const noteX = colX(0, 1, noteW)
const noteY = rowY(2, 140, 60)

export const pipeline: ArchitectureStyle = {
  id: 'pipeline',
  name: 'Pipeline',
  family: 'monolithic',
  tagline: 'Independent filters joined by one-way pipes, one task each.',
  description: [
    'The pipeline style breaks a process into filters connected by pipes. A filter does one thing, knows nothing about the other filters and gets its input from a pipe. Pipes are one-way and point-to-point: a producer starts the flow, transformers and testers shape and route it, a consumer ends it.',
    'It is usually deployed as one program or job: the filters are classes or functions inside a single deployment unit. Some teams run filters as separate processes joined by a broker, which starts to look like event-driven architecture.',
    'It is known for clean, composable code and for the Unix philosophy of small tools joined by pipes. It shines in data processing and shows its limits when the work is not a straight line.',
  ],
  partitioning: 'technical',
  quanta: '1',
  // VERIFY against Fundamentals of Software Architecture 2nd ed., Chapter 12 · Pipeline Architecture Style
  ratings: {
    deployability: 2,
    elasticity: 1,
    evolutionary: 3,
    faultTolerance: 1,
    modularity: 3,
    overallCost: 5,
    performance: 2,
    reliability: 3,
    scalability: 1,
    simplicity: 5,
    testability: 3,
  },
  topology: {
    id: 'topology-pipeline',
    title: 'Pipeline architecture topology',
    level: 'topology',
    height: 440,
    nodes: [
      node('producer', 'filter', 'Producer', filterX(0), filterY(0), filterW, filterH, {
        tech: 'source filter',
        description: 'Reads input and starts the flow',
      }),
      node('transformer', 'filter', 'Transformer', filterX(1), filterY(0), filterW, filterH, {
        tech: 'transform filter',
        description: 'Changes the shape of the data',
      }),
      node('tester', 'filter', 'Tester', filterX(2), filterY(0), filterW, filterH, {
        tech: 'test filter',
        description: 'Checks a condition and routes',
        emphasis: true,
      }),
      node('consumer', 'filter', 'Consumer', filterX(3), filterY(0), filterW, filterH, {
        tech: 'sink filter',
        description: 'Ends the flow, writes output',
      }),
      node('transformer-b', 'filter', 'Transformer', filterX(2), filterY(1), filterW, filterH, {
        tech: 'transform filter',
        description: 'Handles the rejected branch',
      }),
      node('consumer-b', 'filter', 'Consumer', filterX(3), filterY(1), filterW, filterH, {
        tech: 'sink filter',
        description: 'Second output, for example a log',
      }),
      node('oneway', 'note', 'One-way pipes', noteX, noteY, noteW, 60, {
        description: 'Point-to-point, no replies, no shared state',
      }),
    ],
    edges: [
      edge('producer', 'transformer', 'pipe', 'unidirectional'),
      edge('transformer', 'tester', 'pipe', 'unidirectional'),
      edge('tester', 'consumer', 'pipe', 'passes test'),
      edge('tester', 'transformer-b', 'pipe', 'fails test'),
      edge('transformer-b', 'consumer-b', 'pipe', 'unidirectional'),
    ],
    legend: [
      { kind: 'filter', label: 'Filter' },
      { kind: 'note', label: 'Note' },
    ],
  },
  whenToUse: [
    'The problem is a sequence of steps over a stream or a batch of data.',
    'You want small, reusable, testable units with one responsibility each.',
    'ETL, log processing, EDI translation, report generation and similar flows.',
    'A cheap, easy to understand structure matters more than scaling.',
  ],
  whenToAvoid: [
    'The flow needs request and reply, or steps must talk back to each other.',
    'High throughput or bursts require scaling individual steps independently.',
    'Filters need to share state or coordinate transactions.',
    'Fault tolerance is driving: one failing filter stops the whole pipeline.',
  ],
  tradeoffs: {
    pro: [
      'Filters are small, focused and easy to test on their own.',
      'Reordering, replacing or adding a filter is cheap; good evolvability.',
      'Simple to understand and cheap to build and run.',
      'One-way flow makes behaviour easy to reason about and to replay.',
    ],
    con: [
      'One deployment unit, one process: no fault isolation between filters.',
      'Scalability and elasticity are weak; you scale the whole pipeline.',
      'Performance suffers from serialising data between every pair of filters.',
      'Poor fit for interactive or bidirectional workflows.',
    ],
  },
  pitfalls: [
    'Fat filters: a transformer grows into a mini-monolith that does five things.',
    'Chatty pipes: filters passing whole objects back and forth turn the pipe into a two-way call.',
    'Hidden state: a filter that remembers previous items breaks reordering and replay.',
    'Pipeline sprawl: thirty filters with no owner and no diagram.',
  ],
  examples: [
    'Unix shell pipes: grep, sort and uniq chained together.',
    'ETL jobs and data warehouse loaders.',
    'Log and metrics processing chains, for example a Kafka consumer feeding calculators and writers.',
    'EDI message translation and validation steps.',
  ],
  westhaven:
    'The Westhaven integration edge is pipeline shaped: a BAPLIE message arrives, is parsed, validated, enriched with container data and converted into a stowage plan the planner can use, and the same goes for customs and billing messages on the way out. Telemetry from cranes and vehicles is another natural pipeline, from raw PLC events through filtering and aggregation into the maintenance store. As the top-level style for the terminal it fails: one deployment unit gives no fault isolation, and the dispatch loop needs replies and coordination that one-way pipes do not offer. Keep pipelines inside the integration and telemetry services and let a different style carry the 24/7 control work.',
  reference: { chapter: 'Chapter 12 · Pipeline Architecture Style' },
}
