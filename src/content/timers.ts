import type { TimerPreset, TimerPresetId } from './types'

export const timerPresets: TimerPreset[] = [
  { id: 'c1-round', label: 'C1 design round', seconds: 15 * 60 },
  { id: 'feedback', label: 'Feedback round', seconds: 8 * 60 },
  { id: 'clarify', label: 'Clarify with the facilitator', seconds: 3 * 60 },
  { id: 'c2-round', label: 'C2 design round', seconds: 12 * 60 },
  { id: 'short', label: 'Short break / buffer', seconds: 5 * 60 },
]

export const timerPresetById = Object.fromEntries(timerPresets.map((p) => [p.id, p])) as Record<
  TimerPresetId,
  TimerPreset
>
