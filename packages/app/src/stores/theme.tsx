import { create } from 'zustand'
import { combine, persist, createJSONStorage } from 'zustand/middleware'

export type Theme = 'dark' | 'light' | 'system'
export const defaultTheme: Theme = 'system'

function setupTheme(theme?: Theme) {
  if (!theme) {
    theme = useTheme.getState().theme
  }

  const root = window.document.documentElement

  root.classList.remove('light', 'dark')

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light'

    root.classList.add(systemTheme)
    return
  }

  root.classList.add(theme)
  return
}

const useTheme = create(
  persist(
    combine(
      {
        theme: defaultTheme as Theme, // default theme, will be hydrated from localStorage,
      },
      (set) => ({
        setTheme: (theme: Theme) => {
          set({ theme })
          setupTheme(theme)
        },
        /**
         * Empty function that is called to create the store in the page head,
         * this will hydrate the theme to avoid flashes.
         */
        init() {},
      }),
    ),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        // before  hydration

        return (state) => {
          // after hydration
          // initial setup for the theme
          setupTheme(state?.theme)
        }
      },
    },
  ),
)

export { useTheme }
