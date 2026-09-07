import { createStore, useStore } from './createStore'

export type OverlayId = 'toc' | 'timer' | 'help'

export interface UiState {
  overlay: OverlayId | null
  heroCollapsed: boolean
  blank: boolean
  /** The current page's stage is taller than the room under the hero. */
  stageOverflow: boolean
}

export const uiStore = createStore<UiState>({ overlay: null, heroCollapsed: false, blank: false, stageOverflow: false })

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
  setStageOverflow(stageOverflow: boolean): void {
    uiStore.set((s) => (s.stageOverflow === stageOverflow ? s : { ...s, stageOverflow }))
  },
}

export function useUi(): UiState {
  return useStore(uiStore)
}
