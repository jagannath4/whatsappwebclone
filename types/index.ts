export interface Contact {
  name: string
  wa_id: string
}

export interface Message {
  id: string
  conversationId: string
  from: string
  text: string
  timestamp: number
  status: "sent" | "delivered" | "read"
  type: "text"
}

export interface Conversation {
  id: string
  contact: Contact
  lastMessage?: Message
  unreadCount: number
}

export interface WebhookPayload {
  payload_type: string
  _id: string
  metaData: {
    entry: Array<{
      changes: Array<{
        field: string
        value: {
          messaging_product: string
          metadata: {
            display_phone_number: string
            phone_number_id: string
          }
          contacts?: Array<{
            profile: {
              name: string
            }
            wa_id: string
          }>
          messages?: Array<{
            from: string
            id: string
            timestamp: string
            text: {
              body: string
            }
            type: string
          }>
          statuses?: Array<{
            id: string
            recipient_id: string
            status: string
            timestamp: string
            conversation?: {
              id: string
            }
          }>
        }
      }>
      id: string
    }>
    gs_app_id: string
    object: string
  }
  createdAt: string
  executed: boolean
}
