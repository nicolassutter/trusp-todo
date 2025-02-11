import { type AuthRecord } from 'pocketbase'
import { useMutation } from '@tanstack/react-query'
import { getRouteApi, redirect, useNavigate } from '@tanstack/react-router'
import type { OmitIndexSignature } from 'type-fest'
import { create } from 'zustand'
import { pb, type User } from '~/utils/pocketbase'

const useAuthStore = create<{
  user: SafeAuthRecord
  authReady: boolean
}>(() => ({
  user: null,
  /**
   * This is to make sure that auth is ready so we can protect routes
   */
  authReady: false,
}))

const isLoggedIn = () => Boolean(pb.authStore.isValid && pb.authStore.record)

const getCookie = () => pb.authStore.exportToCookie()

/**
 * Remove every `any` from the default type
 */
type SafeAuthRecord = (OmitIndexSignature<AuthRecord> & User) | null | undefined

export const useAuth = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  // we don't have to make it a mutation but just in case of future refactoring
  const logout = useMutation({
    mutationFn: async () => {
      pb.authStore.clear()
    },
    onSuccess() {
      // clear data from cache
      navigate({ to: '/login' })
    },
  })

  const login = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const user = useAuthStore.getState().user

      // already logged in
      if (user) return user

      const result = await pb
        .collection('users')
        .authWithPassword(data.email, data.password)

      return result.record
    },
    async onSuccess() {
      navigate({ to: '/' })
    },
  })

  return { logout, login, user }
}

/**
 * Makes sure that auth is ready which is required for protecting routes
 * WARNING: This function should be called only once per app
 */
export const ensureAuthReady = async (): Promise<SafeAuthRecord> => {
  /**
   * When pb store changes, update ours.
   * By passing `true` as the second argument, we make sure that the callback is fired immediately.
   */
  pb.authStore.onChange(() => {
    const user = isLoggedIn()
      ? (pb.authStore.record as SafeAuthRecord)
      : undefined

    useAuthStore.setState({ user })
  }, true)

  const state = () => useAuthStore.getState()

  if (!state().user) return null

  try {
    await pb.collection('users').authRefresh()
  } catch (_e) {
    // failed to refresh token
    pb.authStore.clear()
  }

  useAuthStore.setState({ authReady: true })

  return state().user
}

export const LoginPageApi = getRouteApi('/login')

export const requireAuth = () => {
  if (!isLoggedIn) {
    throw redirect({
      to: '/login',
    })
  }
}

export { getCookie, isLoggedIn }
