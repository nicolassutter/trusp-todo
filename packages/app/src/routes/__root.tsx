import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { createRootRouteWithContext } from '@tanstack/react-router'
import { ensureAuthReady } from '~/stores/session'
import { SpinLoader } from '~/components/Loaders'
import { ModeToggle } from '~/components/ModeToggle'

type MyRouterContext = { [key: string]: never }

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    // makes sure the user data (if any) is fetched before rendering the app
    const promise = await ensureAuthReady()

    return {
      promise,
    }
  },
  // this is needed because of an issue
  // https://github.com/TanStack/router/issues/2182#issuecomment-2495539306
  wrapInSuspense: true,
  component: RootComponent,
  // according to the docs the pending component will always be shown at least for 500ms
  // to avoid flashing
  pendingComponent: PendingComponent,
})

function PendingComponent() {
  return (
    <div className='fixed inset-0 flex items-center justify-center'>
      <SpinLoader />
    </div>
  )
}

function RootComponent() {
  return (
    <>
      <div>
        <div className='absolute top-2 left-4'>
          <ModeToggle />
        </div>
        <Outlet />
      </div>

      {import.meta.env.DEV && (
        <TanStackRouterDevtools position='bottom-right' />
      )}
    </>
  )
}
