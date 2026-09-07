import { createStore } from './createStore'

export type ThemePreference = 'dark' | 'light' | 'system'

export interface Settings {
  theme: ThemePreference
  /** Speaker notes drawer visible. */
  notes: boolean
  /** Beep when a timer reaches zero. */
  sound: boolean
}

const defaults: Settings = { theme: 'dark', notes: false, sound: true }

export const settingsStore = createStore<Settings>(defaults, 'settings', (raw) => {
  if (!raw || typeof raw !== 'object') return undefined
  const r = raw as Partial<Settings>
  return {
    theme: r.theme === 'light' || r.theme === 'system' ? r.theme : 'dark',
    notes: Boolean(r.notes),
    sound: r.sound !== false,
  }
})

export function resolveTheme(pref: ThemePreference): 'dark' | 'light' {
  if (pref === 'system') {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark'
  }
  return pref
}

export function applyTheme(): void {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = resolveTheme(settingsStore.get().theme)
}

export function cycleTheme(): void {
  const order: ThemePreference[] = ['dark', 'light', 'system']
  settingsStore.set((s) => ({ ...s, theme: order[(order.indexOf(s.theme) + 1) % order.length] }))
}

export function toggleNotes(): void {
  settingsStore.set((s) => ({ ...s, notes: !s.notes }))
}

export function setSetting<K extends keyof Settings>(key: K, value: Settings[K]): void {
  settingsStore.set((s) => ({ ...s, [key]: value }))
}

/* Keep the document theme in sync, including OS changes under "system". */
if (typeof window !== 'undefined') {
  settingsStore.subscribe(applyTheme)
  applyTheme()
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', applyTheme)
}
