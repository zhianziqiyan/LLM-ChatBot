import { ref, nextTick, type Ref } from 'vue'

export function useAutoScroll(containerRef: Ref<HTMLElement | null>) {
  const isNearBottom = ref(true)

  function onScroll() {
    const el = containerRef.value
    if (!el) return
    const threshold = 80
    isNearBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight < threshold
  }

  async function scrollToBottom(smooth = false) {
    await nextTick()
    const el = containerRef.value
    if (!el) return
    el.scrollTo({
      top: el.scrollHeight,
      behavior: smooth ? 'smooth' : 'instant',
    })
  }

  function scrollIfNearBottom() {
    if (isNearBottom.value) {
      scrollToBottom()
    }
  }

  return { isNearBottom, onScroll, scrollToBottom, scrollIfNearBottom }
}
