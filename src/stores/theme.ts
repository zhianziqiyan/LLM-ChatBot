import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ThemeMode } from '@/types'

const STORAGE_KEY = 'theme'
const DARK_CLASS = 'dark'

function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return
  const isDark = mode === 'dark' || (mode === 'auto' && getSystemPreference() === 'dark')
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  document.documentElement.classList.toggle(DARK_CLASS, isDark)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', isDark ? '#0f0f14' : '#ffffff')
}

export const useThemeStore = defineStore(
  'theme',
  () => {
    const mode = ref<ThemeMode>('auto')

    const isDark = ref(false)

    function updateEffectiveTheme() {
      isDark.value = mode.value === 'dark' || (mode.value === 'auto' && getSystemPreference() === 'dark')
    }

    function setMode(newMode: ThemeMode) {
      mode.value = newMode
      updateEffectiveTheme()
      applyTheme(newMode)
    }

    function toggle() {
      const next = mode.value === 'light' ? 'dark' : mode.value === 'dark' ? 'auto' : 'light'
      setMode(next)
    }

    function init() {
      updateEffectiveTheme()
      applyTheme(mode.value)
      if (mode.value === 'auto') {
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        mq.addEventListener('change', () => {
          updateEffectiveTheme()
          applyTheme(mode.value)
        })
      }
    }

    return { mode, isDark, setMode, toggle, init }
  },
  {
    persist: {
      key: STORAGE_KEY,
      pick: ['mode'],
    },
  },
)
