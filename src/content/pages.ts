import type { ArchitectureStyle, CharacteristicId, Kata, PageDef } from './types'
import { characteristicById } from './characteristics'
import { mainPages } from './main-pages'
import { architectureStyles } from './styles'
import { katas } from './katas'

function topAndBottom(style: ArchitectureStyle): { top: string[]; bottom: string[] } {
  const entries = (Object.entries(style.ratings) as [CharacteristicId, number][]).sort((a, b) => b[1] - a[1])
  const label = (id: CharacteristicId) => characteristicById[id].label.toLowerCase()
  return {
    top: entries.slice(0, 3).map(([id]) => label(id)),
    bottom: entries.slice(-2).map(([id]) => label(id)),
  }
}

function stylePage(style: ArchitectureStyle): PageDef {
  const { top, bottom } = topAndBottom(style)
  return {
    id: `style-${style.id}`,
    path: `/styles/${style.id}`,
    title: style.name,
    section: 'styles',
    track: 'sub',
    parent: 'styles',
    component: 'style',
    param: style.id,
    hero: {
      kicker: `${style.family === 'monolithic' ? 'Monolithic' : 'Distributed'} style · ${style.reference.chapter}`,
      title: style.name,
      subtitle: style.tagline,
    },
    notes: [
      `Deep-dive page, use it when the room asks about ${style.name.toLowerCase()} or as reference after the talk.`,
      `Topology tab first: walk the boxes left to right and name the coupling points.`,
      `Ratings tab: strongest on ${top.join(', ')}; weakest on ${bottom.join(' and ')}. Ask where the room has seen that pay off or hurt.`,
      `Westhaven tab: read the paragraph and ask which driving characteristic it would break.`,
      `Left and right arrows move between styles; Escape or up returns to the gallery.`,
    ],
  }
}

function kataPage(kata: Kata): PageDef {
  return {
    id: `kata-${kata.id}`,
    path: `/library/${kata.id}`,
    title: kata.title,
    section: 'live',
    track: 'sub',
    parent: 'library',
    component: 'kata',
    param: kata.id,
    hero: {
      kicker: `Kata · ${kata.difficulty} · ${kata.sourceName}`,
      title: kata.title,
      subtitle: kata.summary,
    },
    notes: [
      'Read the description aloud once, then let the groups read users, requirements and context themselves.',
      'Do not reveal the facilitator hints; they are for you when groups ask the customer questions.',
      `Good for: ${kata.goodFor[0] ?? 'a first round'}.`,
      'Use "Use this kata" to make it the kata of the live round; the timer pages then show its title.',
    ],
  }
}

const subPages: PageDef[] = [...architectureStyles.map(stylePage), ...katas.map(kataPage)]

/** The ordered registry: every main page followed by its sub-track pages. */
export const pages: PageDef[] = mainPages.flatMap((page) => [page, ...subPages.filter((s) => s.parent === page.id)])
