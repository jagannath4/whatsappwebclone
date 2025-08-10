import { NextResponse } from "next/server"
import { getDatabase, testConnection } from "@/lib/mongodb"

export async function GET() {
  try {
    console.log("🔍 Attempting to connect to MongoDB...")
    
    // Test the connection first
    const isConnected = await testConnection()
    
    if (!isConnected) {
      console.log("🔄 MongoDB connection failed, using mock data...")
      // Fallback to mock data
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
    }
    
    console.log("✅ MongoDB connected successfully!")
    const db = await getDatabase()
    const collection = db.collection("processed_messages")

    // Get all conversations with their latest message
    const conversations = await collection
      .aggregate([
        {
          $sort: { timestamp: -1 },
        },
        {
          $group: {
            _id: "$conversationId",
            lastMessage: { $first: "$$ROOT" },
            contact: { $first: "$contact" },
            unreadCount: {
              $sum: {
                $cond: [
                  { $and: [{ $ne: ["$from", "$metadata.display_phone_number"] }, { $ne: ["$status", "read"] }] },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            id: "$_id",
            contact: 1,
            lastMessage: {
              id: "$lastMessage.id",
              text: "$lastMessage.text",
              timestamp: "$lastMessage.timestamp",
              from: "$lastMessage.from",
            },
            unreadCount: 1,
          },
        },
        {
          $sort: { "lastMessage.timestamp": -1 },
        },
      ])
      .toArray()

    console.log(`📊 Found ${conversations.length} conversations from MongoDB`)
    return NextResponse.json(conversations)
  } catch (error) {
    console.error("❌ Error fetching conversations:", error instanceof Error ? error.message : String(error))
    
    // Fallback to mock data if MongoDB fails
    console.log("🔄 Falling back to mock data...")
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
  }
}
