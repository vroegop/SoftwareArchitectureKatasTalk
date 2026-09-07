import type { DiagramSpec } from '../types'
import { node, edge, colX } from '../diagram-helpers'

/* People along the top (outer two lower, so the labels fan out), the platform in the middle,
 * the truck driver and the equipment fleet at the sides, external systems along the bottom. */
const personW = 150
const personX = (i: number) => colX(i, 5, personW)
const extW = 170
const extX = (i: number) => colX(i, 5, extW)

export const westhavenC1: DiagramSpec = {
  id: 'westhaven-c1',
  title: 'Westhaven Terminal Automation Platform: system context (C1)',
  level: 'C1',
  height: 640,
  nodes: [
    node('vessel-planner', 'person', 'Vessel planner', personX(0), 130, personW, 110, {
      description: 'Plans discharge and loading',
    }),
    node('yard-planner', 'person', 'Yard planner', personX(1), 20, personW, 110, {
      description: 'Decides where boxes go',
    }),
    node('crane-operator', 'person', 'Remote crane operator', personX(2), 20, personW, 110, {
      description: 'Finishes moves by hand',
    }),
    node('gate-clerk', 'person', 'Gate clerk', personX(3), 20, personW, 110, {
      description: 'Resolves gate exceptions',
    }),
    node('maintenance', 'person', 'Maintenance engineer', personX(4), 130, personW, 110, {
      description: 'Watches equipment health',
    }),
    node('truck-driver', 'person', 'Truck driver', 20, 290, 140, 110, {
      description: 'Picks up and drops off',
    }),
    node('platform', 'system', 'Terminal Automation Platform', 300, 270, 320, 130, {
      emphasis: true,
      description: 'Plans, dispatches and controls every container move',
    }),
    node('fleet', 'external', 'Equipment fleet (PLCs)', 840, 285, 140, 100, {
      description: 'ASC, AGV, quay cranes',
    }),
    node('shipping-lines', 'external', 'Shipping lines', extX(0), 520, extW, 90, {
      description: 'Stowage plans, bookings',
    }),
    node('pcs', 'external', 'Port community system', extX(1), 520, extW, 90, {
      description: 'Customs declarations, holds',
    }),
    node('appointments', 'external', 'Truck appointment system', extX(2), 520, extW, 90, {
      description: 'Time slots for hauliers',
    }),
    node('erp', 'external', 'ERP / billing', extX(3), 520, extW, 90, {
      description: 'Invoices the moves',
    }),
    node('rail', 'external', 'Rail operator', extX(4), 520, extW, 90, {
      description: 'Train plans and moves',
    }),
  ],
  edges: [
    edge('vessel-planner', 'platform', 'plans vessels in', undefined, { labelAt: 0.4 }),
    edge('yard-planner', 'platform', 'plans the yard in', undefined, { labelAt: 0.3 }),
    edge('crane-operator', 'platform', 'takes over moves in', undefined, { labelAt: 0.55 }),
    edge('gate-clerk', 'platform', 'works exceptions in', undefined, { labelAt: 0.75 }),
    edge('maintenance', 'platform', 'monitors equipment in', undefined, { labelAt: 0.4 }),
    edge('truck-driver', 'platform', 'checks in', 'gate kiosk', { labelAt: 0.5 }),
    edge('platform', 'fleet', 'sends jobs, gets telemetry', 'OPC UA, vendor protocols', { direction: 'both' }),
    edge('shipping-lines', 'platform', 'sends stowage plans to', 'BAPLIE, EDI', { labelAt: 0.35 }),
    edge('platform', 'pcs', 'declares moves to', 'API', { labelAt: 0.7 }),
    edge('platform', 'appointments', 'validates slots with', 'REST', { labelAt: 0.45 }),
    edge('platform', 'erp', 'exports billing to', 'SFTP files', { labelAt: 0.7 }),
    edge('platform', 'rail', 'exchanges plans with', 'EDI', { direction: 'both', labelAt: 0.35 }),
  ],
  legend: [
    { kind: 'person', label: 'Person' },
    { kind: 'system', label: 'The software system' },
    { kind: 'external', label: 'External system' },
  ],
}
