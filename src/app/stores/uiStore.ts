import { createStore, useStore } from './createStore'

export type OverlayId = 'toc' | 'timer' | 'help'

export interface UiState {
  overlay: OverlayId | null
  heroCollapsed: boolean
  blank: boolean
}

export const uiStore = createStore<UiState>({ overlay: null, heroCollapsed: false, blank: false })

export const ui = {
  openOverlay(id: OverlayId): void {
    uiStore.set((s) => ({ ...s, overlay: id }))
  },
  closeOverlay(): void {
    uiStore.set((s) => (s.overlay ? { ...s, overlay: null } : s))
  },
  toggleOverlay(id: OverlayId): void {
    uiStore.set((s) => ({ ...s, overlay: s.overlay === id ? null : id }))
  },
  setHeroCollapsed(collapsed: boolean): void {
    uiStore.set((s) => (s.heroCollapsed === collapsed ? s : { ...s, heroCollapsed: collapsed }))
  },
  toggleHero(): void {
    uiStore.set((s) => ({ ...s, heroCollapsed: !s.heroCollapsed }))
  },
  setBlank(blank: boolean): void {
    uiStore.set((s) => (s.blank === blank ? s : { ...s, blank }))
  },
  toggleBlank(): void {
    uiStore.set((s) => ({ ...s, blank: !s.blank }))
  },
}

export function useUi(): UiState {
  return useStore(uiStore)
}
