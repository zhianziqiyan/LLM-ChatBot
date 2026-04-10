import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { i18n } from '../locale'

export const useLanguageStore = defineStore(
  'language',
  () => {
    const locale = ref('zh')

    watch(locale, (newLocale) => {
      i18n.global.locale.value = newLocale
    }, { immediate: true })

    return {
      locale
    }
  },
  {
    persist: true
  }
)