import type { DiagramSpec } from '../types'
import { node, edge } from '../diagram-helpers'

/* Four rows of containers inside the platform boundary; people above, external systems below.
 * Node ids are referenced by risks.ts and the decision page: keep them stable. */
const boundary = { x: 180, y: 115, w: 640, h: 525 }
const col = [190, 425, 660] as const
const boxW = 150
const rowY = [150, 275, 405, 520] as const

export const westhavenC2: DiagramSpec = {
  id: 'westhaven-c2',
  title: 'Terminal Automation Platform: containers (C2)',
  level: 'C2',
  height: 760,
  nodes: [
    node('boundary', 'boundary', 'Terminal Automation Platform', boundary.x, boundary.y, boundary.w, boundary.h),
    node('planners', 'person', 'Planners', 20, 15, 150, 85, { description: 'Vessel and yard planners' }),
    node('remote-operator', 'person', 'Remote operator', 830, 15, 150, 85, { description: 'Control room' }),
    node('planning-app', 'ui', 'Planning web app', col[0], rowY[0], boxW, 90, {
      tech: 'React SPA',
      description: 'Vessel and yard planning screens',
    }),
    node('gate', 'gateway', 'Gate kiosk & OCR gateway', col[1], rowY[0], boxW, 90, {
      tech: 'edge service',
      description: 'Identifies trucks and containers',
    }),
    node('operator-station', 'ui', 'Remote operator station', col[2], rowY[0], boxW, 90, {
      tech: 'desktop, WPF',
      description: 'Takes over crane moves',
    }),
    node('tos', 'container', 'TOS core', col[0], rowY[1], boxW, 100, {
      tech: 'Kotlin, JVM',
      description: 'Vessel and yard planning, job generation',
    }),
    node('broker', 'queue', 'Message broker', col[1], rowY[1], boxW, 100, {
      tech: 'Kafka',
      description: 'Job and move events',
    }),
    node('ecs', 'container', 'Equipment control service', col[2], rowY[1], boxW, 100, {
      tech: 'Rust',
      description: 'Real-time dispatch, traffic, safety',
      emphasis: true,
    }),
    node('opdb', 'database', 'Operational DB', col[0], rowY[2], boxW, 90, {
      tech: 'PostgreSQL',
      description: 'Plans, moves, audit trail',
    }),
    node('telemetry', 'database', 'Telemetry store', col[1], rowY[2], boxW, 90, {
      tech: 'TimescaleDB',
      description: 'Equipment time series',
    }),
    node('adapters', 'plugin', 'Vendor PLC adapters', col[2], rowY[2], boxW, 90, {
      tech: 'OPC UA, vendor SDKs',
      description: 'One plug-in per vendor',
    }),
    node('integration', 'gateway', 'Integration gateway', col[0], rowY[3], boxW, 90, {
      tech: 'EDI, REST',
      description: 'Stowage plans, customs, billing',
    }),
    node('monitoring', 'container', 'Monitoring & alerting', col[1], rowY[3], boxW, 90, {
      tech: 'Prometheus, Grafana',
      description: 'Watches every container',
    }),
    node('emulator', 'container', 'Emulator / digital twin', col[2], rowY[3], boxW, 90, {
      tech: 'test only',
      description: 'Replaces the fleet in test',
      muted: true,
    }),
    node('externals', 'external', 'Shipping lines, PCS, customs, ERP', 20, 655, 160, 85, {
      description: 'External systems',
    }),
    node('fleet', 'external', 'Equipment fleet (PLCs)', 830, 655, 150, 85, {
      description: 'ASC, AGV, quay cranes',
    }),
  ],
  edges: [
    edge('planners', 'planning-app', 'uses', 'HTTPS'),
    edge('remote-operator', 'operator-station', 'uses'),
    edge('planning-app', 'tos', 'calls', 'JSON/HTTPS', { labelAt: 0.6 }),
    edge('gate', 'tos', 'gate events', 'REST', { labelAt: 0.35 }),
    edge('operator-station', 'ecs', 'takes over moves via', 'gRPC'),
    edge('tos', 'broker', 'jobs, moves', 'Kafka', { direction: 'both' }),
    edge('broker', 'ecs', 'jobs, moves', 'Kafka', { direction: 'both' }),
    edge('tos', 'opdb', 'reads and writes', 'SQL'),
    edge('ecs', 'telemetry', 'writes telemetry', undefined, { labelAt: 0.72 }),
    edge('ecs', 'adapters', 'commands, telemetry', undefined, { direction: 'both', labelAt: 0.4 }),
    edge('monitoring', 'telemetry', 'reads', undefined, { style: 'dashed' }),
    edge('emulator', 'adapters', 'stands in for the fleet', undefined, { style: 'dashed' }),
    edge('integration', 'tos', 'plans, billing', 'EDI', {
      via: [
        { x: 140, y: 565 },
        { x: 140, y: 325 },
      ],
      labelAt: 0.5,
    }),
    edge('integration', 'externals', 'EDI, REST', undefined, { direction: 'both' }),
    edge('adapters', 'fleet', 'PLC I/O', 'OPC UA, proprietary', {
      direction: 'both',
      via: [{ x: 905, y: 445 }],
      labelAt: 0.5,
    }),
  ],
  legend: [
    { kind: 'person', label: 'Person' },
    { kind: 'ui', label: 'User interface' },
    { kind: 'container', label: 'Container (service)' },
    { kind: 'gateway', label: 'Gateway' },
    { kind: 'plugin', label: 'Plug-in adapters' },
    { kind: 'queue', label: 'Message broker' },
    { kind: 'database', label: 'Data store' },
    { kind: 'external', label: 'External system' },
    { kind: 'boundary', label: 'System boundary' },
  ],
}
