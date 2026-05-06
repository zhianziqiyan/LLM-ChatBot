<script setup lang="ts">
import { computed } from 'vue'
import { icons, type IconName } from '@/utils/icons'

const props = withDefaults(
  defineProps<{
    name: IconName
    size?: number | string
  }>(),
  { size: 20 },
)

const sizePx = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
</script>

<template>
  <svg
    :width="sizePx"
    :height="sizePx"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path :d="icons[name]" />
  </svg>
</template>
