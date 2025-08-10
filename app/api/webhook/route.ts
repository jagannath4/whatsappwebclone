import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { WebhookPayload } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const payload: WebhookPayload = await request.json()
    const db = await getDatabase()
    const collection = db.collection("processed_messages")

    // Process the webhook payload
    for (const entry of payload.metaData.entry) {
      for (const change of entry.changes) {
        if (change.field === "messages") {
          const value = change.value

          // Process messages
          if (value.messages) {
            for (const message of value.messages) {
              const contact = value.contacts?.[0]
              if (!contact) continue

              const messageDoc = {
                id: message.id,
                conversationId: `${contact.wa_id}_${value.metadata.phone_number_id}`,
                from: message.from,
                text: message.text.body,
                timestamp: Number.parseInt(message.timestamp),
                status: "sent",
                type: message.type,
                contact: {
                  name: contact.profile.name,
                  wa_id: contact.wa_id,
                },
                metadata: {
                  phone_number_id: value.metadata.phone_number_id,
                  display_phone_number: value.metadata.display_phone_number,
                },
                createdAt: new Date(),
                processed: true,
              }

              await collection.updateOne({ id: message.id }, { $set: messageDoc }, { upsert: true })
            }
          }

          // Process status updates
          if (value.statuses) {
            for (const status of value.statuses) {
              await collection.updateOne(
                { id: status.id },
                {
                  $set: {
                    status: status.status,
                    statusUpdatedAt: new Date(),
                  },
                },
              )
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}
