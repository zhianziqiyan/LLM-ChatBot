// 导入 Markdown 解析核心库（用于将 Markdown 文本转换为 HTML）
import MarkdownIt from 'markdown-it'
// 导入代码高亮库（用于为代码块添加语法高亮样式）
import hljs from 'highlight.js'
// 导入 Markdown 链接属性插件（用于修改生成的链接标签属性）
import mdLinkAttributes from 'markdown-it-link-attributes'
// 导入表情符号插件（支持 Markdown 中的 :emoji: 语法）
import { full as emoji } from 'markdown-it-emoji'
// 导入代码高亮主题样式（atom-one-dark 暗黑主题）
import { CopyDocument } from '@element-plus/icons-vue'

/**
 * 创建 MarkdownIt 实例并配置核心功能
 * 配置项说明：
 * - html: 允许解析 HTML 标签（如 <div>）
 * - breaks: 将 Markdown 中的换行符（\n）转换为 HTML 的 <br> 标签
 * - linkify: 自动识别文本中的 URL 并转换为 <a> 链接
 * - highlight: 自定义代码块高亮逻辑（支持交互按钮）
 */
const md = MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
    highlight: function (str, lang) {
        // 如果代码块有指定语言（如 JavaScript），则使用 highlight.js 进行高亮
        if (lang && hljs.getLanguage(lang)) {
            try {
                const code = hljs.highlight(str, { language: lang ,ignoreIllegals:true}).value
                //包裹代码块为带交互按钮的 HTML 结构（包含语言标识、复制）
                return `<div class="code-block">
                        <div class="code-header">
                            <span class="code-lang">${lang}</span>
                            <button class="copy-btn">复制</button>
                        </div>
                        <pre class="hljs"><code>${code}</code></pre>
                    </div>`
            }catch (__) {}
        }
        // 如果没有指定语言或语言不支持，则使用默认的代码块样式
        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
    }
})

// 使用链接属性插件：配置所有生成的链接在新标签页打开，并添加 rel="noopener" 防止安全风险
md.use(mdLinkAttributes, {
    attrs: {
        target: '_blank',
        rel: 'noopener'
    }
})

// 使用表情符号插件：支持解析 :smile: 等表情符号为可视化图标
md.use(emoji)

/**
 * 渲染 Markdown 内容为 HTML
 * @param {string} content - 原始 Markdown 文本内容
 * @returns {string} 渲染后的 HTML 字符串
 */
export function renderMarkdown(content) {
    return md.render(content)
}

// 导出 MarkdownIt 实例（便于其他模块扩展配置，如添加自定义插件）
export { md}