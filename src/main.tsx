import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createTheme, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import handleError from 'src/utils/handleError'
import { Notifications } from '@mantine/notifications'
import dayjs from 'dayjs'
import localizedFormat  from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)

const theme = createTheme({})

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: handleError
    }
  }
})
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultPendingMinMs: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <ModalsProvider labels={{ confirm: 'Ok', cancel: 'Cancel' }}>
          <RouterProvider router={router} />
          <Notifications position="top-right" />
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
)
