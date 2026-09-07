import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { pages } from '../content/pages'
import { AppShell } from '../components/shell/AppShell'
import { LazyPage } from '../components/shell/LazyPage'
import { NotFound } from '../components/shell/NotFound'

const children: RouteObject[] = pages.map((page) =>
  page.path === '/'
    ? { index: true, element: <LazyPage page={page} /> }
    : { path: page.path.replace(/^\//, ''), element: <LazyPage page={page} /> },
)

export const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppShell />,
      errorElement: <NotFound />,
      children: [...children, { path: '*', element: <NotFound /> }],
    },
  ],
  { basename },
)
