import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './app/styles/theme.css'
import './app/styles/base.css'
import './app/styles/app.css'
import './app/styles/diagrams.css'
import './app/styles/widgets.css'
import './app/styles/pages.css'
import './app/stores/settingsStore'
import { router } from './app/router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
