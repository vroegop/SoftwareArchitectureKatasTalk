import type { ArchitectureStyle, StyleId } from '../types'
import { layered } from './layered'
import { modularMonolith } from './modular-monolith'
import { pipeline } from './pipeline'
import { microkernel } from './microkernel'
import { serviceBased } from './service-based'
import { eventDriven } from './event-driven'
import { spaceBased } from './space-based'
import { orchestrationSoa } from './orchestration-soa'
import { microservices } from './microservices'

/** All nine styles in the order the talk presents them: monolithic first, then distributed. */
export const architectureStyles: ArchitectureStyle[] = [
  layered,
  modularMonolith,
  pipeline,
  microkernel,
  serviceBased,
  eventDriven,
  spaceBased,
  orchestrationSoa,
  microservices,
]

export const styleById = Object.fromEntries(architectureStyles.map((s) => [s.id, s])) as Record<
  StyleId,
  ArchitectureStyle
>
