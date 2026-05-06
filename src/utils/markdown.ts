import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import mdLinkAttributes from 'markdown-it-link-attributes'
import { full as emoji } from 'markdown-it-emoji'

const md = MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  highlight(str: string, lang: string): string {
    const language = lang && hljs.getLanguage(lang) ? lang : ''
    const code = language
      ? hljs.highlight(str, { language, ignoreIllegals: true }).value
      : md.utils.escapeHtml(str)

    const langLabel = language || 'text'
    return `<div class="code-block">
              <div class="code-header">
                <span class="code-lang">${langLabel}</span>
                <button class="copy-btn" data-code="${md.utils.escapeHtml(str)}">Copy</button>
              </div>
              <pre class="hljs"><code>${code}</code></pre>
            </div>`
  },
})

md.use(mdLinkAttributes, {
  attrs: { target: '_blank', rel: 'noopener' },
})

md.use(emoji)

export function renderMarkdown(content: string): string {
  if (!content) return ''
  return md.render(content)
}

export { md }
