import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/chat', async ({ request }) => {
    const req = await request.json()
    
    return HttpResponse.json({
      completion: `Mock response to "${req.message}" (Conversation: ${req.conversationId})\n\nContext length: ${req.context.length} characters`
    }, { status: 200 })
  })
]