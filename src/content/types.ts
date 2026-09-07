/**
 * Content model for the presentation. Everything under `src/content` is pure,
 * typed data: no React, no router, no `import.meta.env`, so it can be imported
 * from Vitest (node) and from Playwright specs alike.
 */

/* ---------------------------------------------------------------- pages */

export type SectionId =
  | 'intro'
  | 'method'
  | 'thinking'
  | 'styles'
  | 'practice'
  | 'live'
  | 'wrapup'

export const SECTION_LABELS: Record<SectionId, string> = {
  intro: 'Why',
  method: 'The method',
  thinking: 'Architectural thinking',
  styles: 'Architecture styles',
  practice: 'Test it on paper',
  live: 'Live round',
  wrapup: 'Bring it home',
}

export interface HeroSpec {
  /** Small label above the title, e.g. "Part 2 · The method". */
  kicker?: string
  title: string
  subtitle?: string
  /** Up to four short lines shown under the subtitle. */
  bullets?: string[]
  quote?: { text: string; by: string }
}

export type TimerPresetId = 'c1-round' | 'feedback' | 'clarify' | 'c2-round' | 'short'

/** Which React component renders a page. Sub-track pages reuse one component with a `param`. */
export type PageComponentId =
  | 'title'
  | 'why'
  | 'shared-language'
  | 'katas'
  | 'case'
  | 'c4'
  | 'session-format'
  | 'laws'
  | 'characteristics'
  | 'star-ratings'
  | 'styles'
  | 'style'
  | 'case-design'
  | 'risk-storming'
  | 'live-setup'
  | 'library'
  | 'kata'
  | 'live-c1'
  | 'live-feedback'
  | 'live-c2'
  | 'live-debrief'
  | 'playbook'
  | 'story'
  | 'references'
  | 'closing'

export interface PageDef {
  id: string
  /** Absolute path without the site base, e.g. `/styles/layered`. */
  path: string
  /** Short title for the table of contents and the browser tab. */
  title: string
  section: SectionId
  /** Main track = the ordered talk; sub = deep-dive pages hanging off a main page. */
  track: 'main' | 'sub'
  /** Id of the main page a sub page belongs to. */
  parent?: string
  component: PageComponentId
  /** Style id or kata id for sub-track pages. */
  param?: string
  hero: HeroSpec
  /** Speaker notes, one bullet per string. Never shown to the audience by default. */
  notes: string[]
  /** Shows a "start timer" button with this preset on the page. */
  timerPreset?: TimerPresetId
  /** Run-of-show marker: minute at which the page is reached in a 90-minute session. */
  minute?: number
}

/* ------------------------------------------------- characteristics & styles */

export type CharacteristicId =
  | 'deployability'
  | 'elasticity'
  | 'evolutionary'
  | 'faultTolerance'
  | 'modularity'
  | 'overallCost'
  | 'performance'
  | 'reliability'
  | 'scalability'
  | 'simplicity'
  | 'testability'

export interface Characteristic {
  id: CharacteristicId
  label: string
  /** Very short label for matrix headers, e.g. "Deploy". */
  short: string
  group: 'operational' | 'structural' | 'cross-cutting'
  description: string
}

export type Rating = 1 | 2 | 3 | 4 | 5

export type StyleId =
  | 'layered'
  | 'modular-monolith'
  | 'pipeline'
  | 'microkernel'
  | 'service-based'
  | 'event-driven'
  | 'space-based'
  | 'orchestration-soa'
  | 'microservices'

export interface ArchitectureStyle {
  id: StyleId
  name: string
  family: 'monolithic' | 'distributed'
  /** One line, shown on the gallery card. */
  tagline: string
  /** Two or three short paragraphs. */
  description: string[]
  partitioning: 'technical' | 'domain' | 'technical & domain'
  quanta: '1' | '1 to many'
  /** Star ratings as published in Fundamentals of Software Architecture, 2nd ed. */
  ratings: Record<CharacteristicId, Rating>
  topology: DiagramSpec
  whenToUse: string[]
  whenToAvoid: string[]
  tradeoffs: { pro: string[]; con: string[] }
  /** Named anti-patterns and pitfalls, one line each. */
  pitfalls: string[]
  /** Typical real-world uses, one line each. */
  examples: string[]
  /** How the Westhaven terminal case would look in this style (one paragraph). */
  westhaven: string
  reference: { chapter: string }
}

/* --------------------------------------------------------------- katas */

export interface Kata {
  id: string
  title: string
  sourceUrl: string
  sourceName: string
  author: string
  summary: string
  users: string
  requirements: string[]
  additionalContext: string[]
  tags: string[]
  difficulty: 'starter' | 'intermediate' | 'advanced'
  /** Why a facilitator would pick this one, one line each. */
  goodFor: string[]
  /** Suggested driving characteristics and traps; hidden behind a toggle. */
  facilitatorHints: string[]
}

/* ------------------------------------------------------------ diagrams */

export type NodeKind =
  | 'person'
  | 'system'
  | 'external'
  | 'container'
  | 'component'
  | 'boundary'
  | 'layer'
  | 'service'
  | 'database'
  | 'queue'
  | 'core'
  | 'plugin'
  | 'ui'
  | 'gateway'
  | 'space'
  | 'filter'
  | 'note'

export const NODE_KIND_LABELS: Record<NodeKind, string> = {
  person: 'Person',
  system: 'Software system',
  external: 'External system',
  container: 'Container',
  component: 'Component',
  boundary: 'Boundary',
  layer: 'Layer',
  service: 'Service',
  database: 'Database',
  queue: 'Broker / queue',
  core: 'Core system',
  plugin: 'Plug-in',
  ui: 'User interface',
  gateway: 'Gateway / mediator',
  space: 'Processing unit',
  filter: 'Filter',
  note: 'Note',
}

/** Coordinates live in a `0..width × 0..height` box; `width` defaults to 1000. */
export interface DiagramNode {
  id: string
  kind: NodeKind
  label: string
  /** Technology, shown in brackets under the label. */
  tech?: string
  /** One short sentence about the responsibility. */
  description?: string
  x: number
  y: number
  w: number
  h: number
  emphasis?: boolean
  muted?: boolean
}

export interface DiagramEdge {
  id: string
  from: string
  to: string
  label?: string
  /** Protocol/technology, shown under the label, e.g. "JSON/HTTPS". */
  tech?: string
  direction?: 'forward' | 'both' | 'none'
  route?: 'straight' | 'orthogonal'
  /** Manual waypoints in diagram coordinates. */
  via?: { x: number; y: number }[]
  style?: 'solid' | 'dashed'
  /** Where along the longest segment the label sits, 0 = start, 1 = end (default 0.5). */
  labelAt?: number
}

export interface LegendItem {
  kind: NodeKind
  label: string
}

export interface DiagramSpec {
  id: string
  title: string
  level?: 'C1' | 'C2' | 'C3' | 'topology'
  width?: number
  height: number
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  legend?: LegendItem[]
}

/* --------------------------------------------------------- risk storming */

export type RiskLevel = 1 | 2 | 3

export interface RiskSticky {
  id: string
  diagramId: string
  /** Node or edge id the sticky is attached to. */
  targetId: string
  probability: RiskLevel
  impact: RiskLevel
  note: string
  createdAt: number
}

export interface SeedRisk {
  targetId: string
  probability: RiskLevel
  impact: RiskLevel
  note: string
}

/* ------------------------------------------------------------- decisions */

export interface Adr {
  title: string
  status: string
  date?: string
  context: string[]
  decision: string[]
  consequences: string[]
  alternatives: { name: string; why: string }[]
}

/* ------------------------------------------------------------ references */

export type ReferenceType = 'book' | 'site' | 'tool' | 'video' | 'article'
export type ReferenceTopic =
  | 'katas'
  | 'c4'
  | 'styles'
  | 'characteristics'
  | 'techniques'
  | 'facilitation'

export interface Reference {
  id: string
  type: ReferenceType
  title: string
  by?: string
  url: string
  topics: ReferenceTopic[]
  note: string
}

/* ---------------------------------------------------------------- timers */

export interface TimerPreset {
  id: TimerPresetId
  label: string
  seconds: number
}
