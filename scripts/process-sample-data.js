const { MongoClient } = require("mongodb")
const fs = require("fs")
const path = require("path")
const dotenv = require("dotenv")

// Fix for Windows SSL/TLS issues with MongoDB Atlas
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

// Load environment variables from .env file
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"

async function processSampleData() {
  const client = new MongoClient(MONGODB_URI, {
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true
  })

  try {
    await client.connect()
    const db = client.db("whatsapp")
    const collection = db.collection("processed_messages")

    // Clear existing data
    await collection.deleteMany({})
    console.log("Cleared existing data")

    // Read all JSON files from the project root
    const files = [
      "conversation_1_message_1.json",
      "conversation_1_message_2.json",
      "conversation_1_status_1.json",
      "conversation_1_status_2.json",
      "conversation_2_message_1.json",
      "conversation_2_message_2.json",
      "conversation_2_status_1.json",
      "conversation_2_status_2.json",
    ]

    for (const filename of files) {
      try {
        const filePath = path.join(process.cwd(), filename)
        const fileContent = fs.readFileSync(filePath, "utf8")
        const payload = JSON.parse(fileContent)

        console.log(`Processing ${filename}...`)

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

                  console.log(`  - Inserted message: ${message.text.body}`)
                }
              }

              // Process status updates
              if (value.statuses) {
                for (const status of value.statuses) {
                  const result = await collection.updateOne(
                    { id: status.id },
                    {
                      $set: {
                        status: status.status,
                        statusUpdatedAt: new Date(),
                      },
                    },
                  )

                  if (result.modifiedCount > 0) {
                    console.log(`  - Updated status for message ${status.id}: ${status.status}`)
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error processing ${filename}:`, error)
      }
    }

    // Display summary
    const totalMessages = await collection.countDocuments()
    const conversations = await collection.distinct("conversationId")

    console.log("\n=== Processing Complete ===")
    console.log(`Total messages processed: ${totalMessages}`)
    console.log(`Total conversations: ${conversations.length}`)
    console.log("Conversations:", conversations)
  } catch (error) {
    console.error("Error:", error)
  } finally {
    await client.close()
  }
}

processSampleData()
