export interface KeyBinding {
  keys: string[]
  action: string
}

/** Shown in the help overlay; the handler lives in `useKeyboardNav`. */
export const KEY_BINDINGS: KeyBinding[] = [
  { keys: ['→', 'PgDn'], action: 'Next page' },
  { keys: ['←', 'PgUp'], action: 'Previous page' },
  { keys: ['Space'], action: 'Next step on the page, then next page (Shift reverses)' },
  { keys: ['↓'], action: 'Dive into the deep-dive pages (styles, katas)' },
  { keys: ['↑', 'Esc'], action: 'Back up to the parent page, or close a panel' },
  { keys: ['Home', 'End'], action: 'First / last page' },
  { keys: ['T'], action: 'Table of contents' },
  { keys: ['N'], action: 'Speaker notes' },
  { keys: ['C'], action: 'Round timer' },
  { keys: ['H'], action: 'Collapse the hero to give the interactive part the stage' },
  { keys: ['D'], action: 'Theme: dark, light, system' },
  { keys: ['F'], action: 'Fullscreen' },
  { keys: ['B'], action: 'Blank screen' },
  { keys: ['?'], action: 'This help' },
]

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
