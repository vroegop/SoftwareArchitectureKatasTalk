/**
 * Types for the interactive parts of individual pages. Kept separate from the
 * core model in `types.ts` so page content files stay small and focused.
 */
import type { CharacteristicId, StyleId, TimerPresetId } from './types'

/* ------------------------------------------------------------- /why */

export type PersonaId = 'junior' | 'medior' | 'senior' | 'architect' | 'organisation'

export interface Persona {
  id: PersonaId
  label: string
  /** What this person is afraid of when architecture comes up. One sentence. */
  fear: string
  /** What they get out of kata + C4 rounds. Three to four short lines. */
  gains: string[]
  /** What changes after a few months of monthly practice. One sentence. */
  afterPractice: string
}

export interface CostRow {
  /** Row label, e.g. "Time until you learn you were wrong". */
  aspect: string
  production: string
  kata: string
}

/* -------------------------------------------------- /shared-language */

export interface ConversationLine {
  who: string
  text: string
}

export interface ConversationVariant {
  id: 'before' | 'after'
  title: string
  lines: ConversationLine[]
  outcome: string
  minutesToDecision: number
}

/* ------------------------------------------------------------ /katas */

export interface KataAnatomyPart {
  id: 'description' | 'users' | 'requirements' | 'context'
  title: string
  /** Why this part matters to the designing group. */
  why: string
  /** Questions a group should ask about this part. */
  questionsToAsk: string[]
}

export interface KataRule {
  title: string
  detail: string
}

export interface TimelineItem {
  year: string
  text: string
}

/* ------------------------------------------------------------- /case */

export interface CustomerQuestion {
  q: string
  a: string
}

/* --------------------------------------------------------------- /c4 */

export interface C4Level {
  id: 'C1' | 'C2' | 'C3' | 'C4'
  name: string
  /** The question the diagram answers. */
  question: string
  audience: string
  shows: string[]
  tip: string
}

export interface NotationCheck {
  id: string
  label: string
  why: string
}

/* ---------------------------------------------------- /session-format */

export interface SessionPhase {
  id: string
  title: string
  /** Minutes in the 90-minute reference schedule. */
  minutes: number
  goal: string
  deliverable: string
  /** What the facilitator does during this phase. */
  facilitator: string
  tips: string[]
  timerPreset?: TimerPresetId
  optional?: boolean
}

/* ------------------------------------------------------------- /laws */

export interface Law {
  number: number
  text: string
  /** e.g. "1st and 2nd edition" or "added in the 2nd edition". */
  edition: string
  explanation: string
}

export interface TradeoffSlider {
  id: string
  left: string
  right: string
  leftGains: string[]
  rightGains: string[]
  /** The question to ask before moving the slider. */
  question: string
}

/* -------------------------------------------------- /characteristics */

export interface CharacteristicExample {
  group: 'operational' | 'structural' | 'cross-cutting'
  examples: string[]
}

export interface CharacteristicPick {
  contextId: string
  contextLabel: string
  contextDescription: string
  top3: CharacteristicId[]
  rationale: string
}

/* ------------------------------------------------------ /case-design */

export interface StyleShortlistEntry {
  styleId: StyleId
  verdict: 'chosen' | 'considered' | 'rejected'
  reason: string
}

/* ------------------------------------------------------- /live pages */

export interface ChecklistItem {
  label: string
  hint?: string
}

export interface ChecklistDef {
  id: string
  title: string
  items: ChecklistItem[]
}

export interface FeedbackPrompt {
  level: 'C1' | 'C2' | 'C3' | 'any'
  prompt: string
}

export interface Material {
  item: string
  note?: string
}

/* ---------------------------------------------------------- /playbook */

export interface PlaybookItem {
  label: string
  detail?: string
}

export interface PlaybookSection {
  id: string
  title: string
  items: PlaybookItem[]
}

export interface SessionVariant {
  title: string
  duration: string
  description: string
  agenda: string[]
}

/* ------------------------------------------------ /title and /closing */

export interface AgendaItem {
  minute: number
  label: string
}

export interface Takeaway {
  title: string
  detail: string
}
