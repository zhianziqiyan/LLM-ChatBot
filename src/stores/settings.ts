import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { AppSettings } from '@/types'
import { DEFAULT_SETTINGS } from '@/config'

export const useSettingStore = defineStore(
  'settings',
  () => {
    const settings = reactive<AppSettings>({ ...DEFAULT_SETTINGS })

    function updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
      settings[key] = value
    }

    function resetSettings() {
      Object.assign(settings, DEFAULT_SETTINGS)
    }

    return { settings, updateSetting, resetSettings }
  },
  { persist: true },
)
