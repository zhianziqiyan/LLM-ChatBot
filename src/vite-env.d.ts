/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'markdown-it-emoji' {
  import type MarkdownIt from 'markdown-it'
  const plugin: MarkdownIt.PluginSimple
  export default plugin
  export const full: MarkdownIt.PluginSimple
}

declare module 'markdown-it-link-attributes' {
  import type MarkdownIt from 'markdown-it'
  interface LinkAttributesOptions {
    attrs?: Record<string, string>
  }
  function mdLinkAttributes(md: MarkdownIt, options?: LinkAttributesOptions): void
  export default mdLinkAttributes
}
