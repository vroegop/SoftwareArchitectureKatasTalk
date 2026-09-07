import { Suspense } from 'react'
import { pageComponents } from '../../app/pageComponents'
import type { PageDef } from '../../content/types'

export function LazyPage({ page }: { page: PageDef }) {
  const Component = pageComponents[page.component]
  return (
    <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
      <Component key={page.id} page={page} />
    </Suspense>
  )
}
