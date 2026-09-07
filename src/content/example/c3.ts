import type { DiagramSpec } from '../types'
import { node, edge } from '../diagram-helpers'

/* Components of the equipment control service; the actors it talks to sit outside the boundary. */
const col = [200, 410, 620] as const

export const westhavenC3: DiagramSpec = {
  id: 'westhaven-c3',
  title: 'Equipment control service: components (C3)',
  level: 'C3',
  height: 560,
  nodes: [
    node('boundary', 'boundary', 'Equipment control service (ECS)', 180, 95, 640, 375),
    node('operator-station', 'ui', 'Remote operator station', 20, 130, 150, 80, { tech: 'desktop' }),
    node('broker', 'queue', 'Message broker', 20, 260, 150, 80, { tech: 'Kafka' }),
    node('command-api', 'component', 'Command API', col[0], 120, 180, 80, {
      tech: 'gRPC',
      description: 'Receives take-over commands',
    }),
    node('traffic', 'component', 'Traffic manager', col[1], 120, 180, 80, {
      description: 'Route planning, deadlock avoidance',
      emphasis: true,
    }),
    node('safety', 'component', 'Safety-zone monitor', col[2], 120, 180, 80, {
      description: 'Vetoes any unsafe command',
    }),
    node('dispatcher', 'component', 'Job dispatcher', col[0], 250, 180, 80, {
      description: 'Assigns jobs to equipment',
    }),
    node('state', 'component', 'Equipment state tracker', col[1], 250, 180, 80, {
      description: 'Position, status, health',
    }),
    node('adapter-host', 'component', 'Adapter host', col[2], 250, 180, 80, {
      description: 'Loads vendor plug-ins',
    }),
    node('publisher', 'component', 'Telemetry publisher', col[1], 370, 180, 70, {
      description: 'Streams state changes',
    }),
    node('adapters', 'plugin', 'Vendor PLC adapters', 840, 250, 140, 90, { tech: 'plug-ins' }),
    node('telemetry', 'database', 'Telemetry store', 840, 385, 140, 70, { tech: 'TimescaleDB' }),
  ],
  edges: [
    edge('operator-station', 'command-api', 'take over', 'gRPC'),
    edge('broker', 'dispatcher', 'delivers jobs', 'Kafka'),
    edge('command-api', 'dispatcher', 'manual job'),
    edge('dispatcher', 'traffic', 'requests route', undefined, { labelAt: 0.5 }),
    edge('traffic', 'safety', 'checks move'),
    edge('safety', 'adapter-host', 'releases command'),
    edge('adapter-host', 'adapters', 'commands / telemetry', undefined, { direction: 'both' }),
    edge('adapter-host', 'state', 'telemetry', undefined, { style: 'dashed' }),
    edge('state', 'traffic', 'positions'),
    edge('state', 'publisher', 'state changes'),
    edge('publisher', 'telemetry', 'writes', undefined, { labelAt: 0.45 }),
    edge('publisher', 'broker', 'publishes move updates', 'Kafka', {
      via: [{ x: 95, y: 405 }],
      labelAt: 0.5,
    }),
  ],
  legend: [
    { kind: 'component', label: 'Component' },
    { kind: 'boundary', label: 'Container boundary' },
    { kind: 'ui', label: 'User interface' },
    { kind: 'queue', label: 'Message broker' },
    { kind: 'plugin', label: 'Plug-in adapters' },
    { kind: 'database', label: 'Data store' },
  ],
}
