import { useLocation } from 'react-router-dom'
import type { PageDef } from '../content/types'
import { pageForPath } from './registry'

export function useCurrentPage(): PageDef | undefined {
  const location = useLocation()
  return pageForPath(location.pathname)
}
