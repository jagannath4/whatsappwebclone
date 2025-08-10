import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
  try {
    const { conversationId } = await params
    
    // Mock data for testing
    const mockMessages = {
      "919937320320_629305560276479": [
        {
          id: "wamid.HBgMOTE5OTY3NTc4NzIwFQIAEhggMTIzQURFRjEyMzQ1Njc4OTA=",
          conversationId: "919937320320_629305560276479",
          from: "919937320320",
          text: "Hi, I'd like to know more about your services.",
          timestamp: 1754400000,
          status: "read",
          type: "text"
        },
        {
          id: "wamid.HBgMOTE5OTY3NTc4NzIwFQIAEhggNDc4NzZBQ0YxMjdCQ0VFOTk2NzA3MTI4RkZCNjYyMjc=",
          conversationId: "919937320320_629305560276479",
          from: "918329446654",
          text: "Hi Ravi! Sure, I'd be happy to help you with that. Could you tell me what you're looking for?",
          timestamp: 1754400020,
          status: "read",
          type: "text"
        }
      ],
      "929967673820_629305560276479": [
        {
          id: "wamid.HBgMOTI5OTY3NjczODIwFQIAEhggQ0FBQkNERUYwMDFGRjEyMzQ1NkZGQTk5RTJCM0I2NzY=",
          conversationId: "929967673820_629305560276479",
          from: "929967673820",
          text: "Hi, I saw your ad. Can you share more details?",
          timestamp: 1754401000,
          status: "delivered",
          type: "text"
        },
        {
          id: "wamid.HBgMOTI5OTY3NjczODIwFQIAEhggM0RFNDkxRjEwNDhDQzgwMzk3NzA1ODc1RkU3QzI0MzU=",
          conversationId: "929967673820_629305560276479",
          from: "918329446654",
          text: "Hi Neha! Absolutely. We offer curated home decor pieces—are you looking for nameplates, wall art, or something else?",
          timestamp: 1754401030,
          status: "delivered",
          type: "text"
        }
      ]
    }

    const messages = mockMessages[conversationId as keyof typeof mockMessages] || []
    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
