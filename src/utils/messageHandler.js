export const messageHandler = {
    formatMessage(role, content, reasoning_content = '') {
        return {
            id: Date.now(),
            role,
            content,
            reasoning_content,
            completion_tokens: 0,
            speed: 0,
            loading: false,
        }
    },

    async handleStreamResponse(response, updateCallback) {
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedContent = ''
      let accumulatedReasoning = ''
      let buffer = ''
      let startTime = Date.now()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        buffer += chunk

        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmedLine = line.trim()
          if (!trimmedLine) continue
          if (trimmedLine === 'data: [DONE]') continue
          if (trimmedLine.startsWith('data: ')) {
            try {
              const jsonStr = trimmedLine.slice(6)
              const data = JSON.parse(jsonStr)
              const delta = data.choices?.[0]?.delta || {}
              const content = delta.content || ''
              const reasoning = delta.reasoning_content || ''

              accumulatedContent += content
              accumulatedReasoning += reasoning

              updateCallback(
                accumulatedContent,
                accumulatedReasoning,
                data.usage?.completion_tokens || 0,
                data.usage?.completion_tokens ? ((data.usage.completion_tokens) / ((Date.now() - startTime) / 1000)).toFixed(2) : 0
              )
            } catch (e) {
              console.warn('Parse line error:', e, 'Line:', trimmedLine)
            }
          }
        }
      }

      if (buffer.trim()) {
        const trimmedLine = buffer.trim()
        if (trimmedLine.startsWith('data: ')) {
          try {
            const jsonStr = trimmedLine.slice(6)
            const data = JSON.parse(jsonStr)
            const delta = data.choices?.[0]?.delta || {}
            const content = delta.content || ''
            const reasoning = delta.reasoning_content || ''

            accumulatedContent += content
            accumulatedReasoning += reasoning

            updateCallback(
              accumulatedContent,
              accumulatedReasoning,
              data.usage?.completion_tokens || 0,
              data.usage?.completion_tokens ? ((data.usage.completion_tokens) / ((Date.now() - startTime) / 1000)).toFixed(2) : 0
            )
          } catch (e) {
            console.warn('Parse final buffer error:', e)
          }
        }
      }
    },

    handleNormalResponse(response, updateCallback) {
        updateCallback(
          response.choices[0].message.content,
          response.choices[0].message.reasoning_content || '',
          response.usage.completion_tokens,
          response.speed
        )
      },

      async handleResponse(response, isStream, updateCallback) {
        if (isStream) {
          await this.handleStreamResponse(response, updateCallback)
        } else {
          this.handleNormalResponse(response, updateCallback)
        }
      },
}
