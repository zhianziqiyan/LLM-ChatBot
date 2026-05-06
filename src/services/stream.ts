import type { StreamUpdate, StreamChunk, ChatCompletionResponse } from '@/types'

export type UpdateCallback = (update: StreamUpdate) => void

export async function handleStreamResponse(
  response: Response,
  onUpdate: UpdateCallback,
): Promise<void> {
  const reader = response.body?.getReader()
  if (!reader) throw new Error('Response body is not readable')

  const decoder = new TextDecoder()
  let content = ''
  let reasoning = ''
  let buffer = ''
  const startTime = Date.now()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      processLine(line)
    }
  }

  if (buffer.trim()) {
    processLine(buffer.trim())
  }

  function processLine(line: string) {
    const trimmed = line.trim()
    if (!trimmed || trimmed === 'data: [DONE]') return
    if (!trimmed.startsWith('data: ')) return

    try {
      const data: StreamChunk = JSON.parse(trimmed.slice(6))
      const delta = data.choices?.[0]?.delta
      if (!delta) return

      content += delta.content ?? ''
      reasoning += delta.reasoning_content ?? ''

      const tokens = data.usage?.completion_tokens ?? 0
      const elapsed = (Date.now() - startTime) / 1000
      const speed = tokens > 0 ? (tokens / elapsed).toFixed(2) : '0'

      onUpdate({ content, reasoning_content: reasoning, completion_tokens: tokens, speed })
    } catch {
      // Skip malformed lines
    }
  }
}

export function handleNormalResponse(
  data: ChatCompletionResponse,
  onUpdate: UpdateCallback,
): void {
  const msg = data.choices[0]?.message
  onUpdate({
    content: msg?.content ?? '',
    reasoning_content: msg?.reasoning_content ?? '',
    completion_tokens: data.usage?.completion_tokens ?? 0,
    speed: data.speed ?? '0',
  })
}
