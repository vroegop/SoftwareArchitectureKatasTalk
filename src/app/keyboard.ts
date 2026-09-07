export interface KeyBinding {
  keys: string[]
  action: string
}

/** Shown in the help overlay; the handler lives in `useKeyboardNav`. */
export const KEY_BINDINGS: KeyBinding[] = [
  { keys: ['PgDn', '→', 'Space', 'Enter'], action: 'Forward: make room for the stage, then the next step on the page, then the next page (clicker)' },
  { keys: ['PgUp', '←', 'Backspace'], action: 'Back: previous step, then the hero, then the previous page in its final state' },
  { keys: ['Shift + →', 'Shift + ←'], action: 'Jump a whole page, ignoring steps' },
  { keys: ['↓'], action: 'Dive into the deep-dive pages (katas under the library)' },
  { keys: ['↑', 'Esc'], action: 'Back up to the parent page, or close a panel' },
  { keys: ['Home', 'End'], action: 'First / last page' },
  { keys: ['T'], action: 'Table of contents' },
  { keys: ['N'], action: 'Speaker notes' },
  { keys: ['C'], action: 'Round timer' },
  { keys: ['H'], action: 'Collapse or expand the hero by hand' },
  { keys: ['D'], action: 'Theme: dark, light, system' },
  { keys: ['F', 'F5'], action: 'Fullscreen' },
  { keys: ['B', '.'], action: 'Blank screen' },
  { keys: ['?'], action: 'This help' },
]

export const FORWARD_KEYS = new Set(['ArrowRight', 'PageDown', ' ', 'Enter'])
export const BACK_KEYS = new Set(['ArrowLeft', 'PageUp', 'Backspace'])

/** Human label for a key event, for the clicker tester. */
export function describeKey(e: KeyboardEvent): string {
  const names: Record<string, string> = {
    ' ': 'Space',
    ArrowRight: '→',
    ArrowLeft: '←',
    ArrowUp: '↑',
    ArrowDown: '↓',
    PageDown: 'PgDn',
    PageUp: 'PgUp',
    Escape: 'Esc',
  }
  const base = names[e.key] ?? (e.key.length === 1 ? e.key.toUpperCase() : e.key)
  return e.shiftKey && e.key.length > 1 ? `Shift + ${base}` : base
}

/** What the deck does with a key, for the clicker tester. */
export function describeAction(e: KeyboardEvent): string {
  if (e.shiftKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) return 'jump a whole page'
  if (e.shiftKey && e.key === ' ') return 'back'
  if (FORWARD_KEYS.has(e.key)) return 'forward'
  if (BACK_KEYS.has(e.key)) return 'back'
  const found = KEY_BINDINGS.find((b) => b.keys.some((k) => k.toLowerCase() === describeKey(e).toLowerCase()))
  return found ? found.action : 'nothing'
}

const EDITABLE = 'input, textarea, select, [contenteditable="true"], [contenteditable=""]'
const BUTTON_LIKE = 'button, a, [role="button"], summary'

export function isEditableTarget(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(EDITABLE) !== null
}

export function isButtonLike(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(BUTTON_LIKE) !== null
}

/** Widgets that need the arrow keys wrap themselves in `[data-keys="local"]`. */
export function isLocalKeysTarget(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest('[data-keys="local"]') !== null
}
