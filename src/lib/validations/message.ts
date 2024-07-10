import { z } from 'zod'

export const messagesValidator = z.object({
    id: z.string(),
    senderId: z.string(),
    text: z.string(),
    timestamp: z.number()
})

export const messageArrayValidator = z.array(messagesValidator)

export type Message = z.infer<typeof messagesValidator>