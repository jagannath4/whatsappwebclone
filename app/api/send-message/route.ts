import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { conversationId, recipientId, text } = await request.json()

    if (!conversationId || !recipientId || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const messageId = `wamid.${Date.now()}.${Math.random().toString(36).substr(2, 9)}`
    const timestamp = Math.floor(Date.now() / 1000)

    const newMessage = {
      id: messageId,
      conversationId,
      from: "918329446654", // Mock sender ID
      text,
      timestamp,
      status: "sent",
      type: "text",
    }

    // In a real implementation, this would save to MongoDB
    console.log("Mock: Message saved:", newMessage)

    return NextResponse.json(newMessage)
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
