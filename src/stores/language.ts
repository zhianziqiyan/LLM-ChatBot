import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { i18n } from '@/locale'
import type { Language } from '@/types'

export const useLanguageStore = defineStore(
  'language',
  () => {
    const locale = ref<Language>('zh')

    watch(
      locale,
      (val) => {
        i18n.global.locale.value = val
      },
      { immediate: true },
    )

    function toggle() {
      locale.value = locale.value === 'zh' ? 'en' : 'zh'
    }

    return { locale, toggle }
  },
  { persist: true },
)
