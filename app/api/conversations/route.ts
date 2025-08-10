import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock data for testing
    const mockConversations = [
      {
        id: "919937320320_629305560276479",
        contact: {
          name: "Ravi Kumar",
          wa_id: "919937320320"
        },
        lastMessage: {
          id: "wamid.HBgMOTE5OTY3NTc4NzIwFQIAEhggNDc4NzZBQ0YxMjdCQ0VFOTk2NzA3MTI4RkZCNjYyMjc=",
          text: "Hi Ravi! Sure, I'd be happy to help you with that. Could you tell me what you're looking for?",
          timestamp: 1754400020,
          from: "918329446654"
        },
        unreadCount: 0
      },
      {
        id: "929967673820_629305560276479",
        contact: {
          name: "Neha Joshi",
          wa_id: "929967673820"
        },
        lastMessage: {
          id: "wamid.HBgMOTI5OTY3NjczODIwFQIAEhggM0RFNDkxRjEwNDhDQzgwMzk3NzA1ODc1RkU3QzI0MzU=",
          text: "Hi Neha! Absolutely. We offer curated home decor pieces—are you looking for nameplates, wall art, or something else?",
          timestamp: 1754401030,
          from: "918329446654"
        },
        unreadCount: 1
      }
    ]

    return NextResponse.json(mockConversations)
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}
