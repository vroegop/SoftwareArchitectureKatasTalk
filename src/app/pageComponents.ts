import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { PageComponentId, PageDef } from '../content/types'

export interface PageProps {
  page: PageDef
}

type PageComponent = LazyExoticComponent<ComponentType<PageProps>>

/** One lazy chunk per page component; keys must cover every `PageComponentId`. */
export const pageComponents: Record<PageComponentId, PageComponent> = {
  title: lazy(() => import('../pages/TitlePage')),
  why: lazy(() => import('../pages/WhyPage')),
  'shared-language': lazy(() => import('../pages/SharedLanguagePage')),
  katas: lazy(() => import('../pages/KatasPage')),
  case: lazy(() => import('../pages/CasePage')),
  c4: lazy(() => import('../pages/C4Page')),
  'session-format': lazy(() => import('../pages/SessionFormatPage')),
  laws: lazy(() => import('../pages/LawsPage')),
  characteristics: lazy(() => import('../pages/CharacteristicsPage')),
  'star-ratings': lazy(() => import('../pages/StarRatingsPage')),
  styles: lazy(() => import('../pages/StylesPage')),
  style: lazy(() => import('../pages/StylePage')),
  'case-design': lazy(() => import('../pages/CaseDesignPage')),
  'risk-storming': lazy(() => import('../pages/RiskStormingPage')),
  'live-setup': lazy(() => import('../pages/LiveSetupPage')),
  library: lazy(() => import('../pages/LibraryPage')),
  kata: lazy(() => import('../pages/KataPage')),
  'live-c1': lazy(() => import('../pages/LiveC1Page')),
  'live-feedback': lazy(() => import('../pages/LiveFeedbackPage')),
  'live-c2': lazy(() => import('../pages/LiveC2Page')),
  'live-debrief': lazy(() => import('../pages/LiveDebriefPage')),
  playbook: lazy(() => import('../pages/PlaybookPage')),
  story: lazy(() => import('../pages/StoryPage')),
  references: lazy(() => import('../pages/ReferencesPage')),
  closing: lazy(() => import('../pages/ClosingPage')),
}
