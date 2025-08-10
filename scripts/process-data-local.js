const fs = require("fs")
const path = require("path")

async function processSampleDataLocal() {
  console.log("Processing sample data locally...")

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

  const processedMessages = []
  const messageMap = new Map() // To track messages by ID for status updates

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

                messageMap.set(message.id, messageDoc)
                processedMessages.push(messageDoc)

                console.log(`  - Processed message: ${message.text.body}`)
              }
            }

            // Process status updates
            if (value.statuses) {
              for (const status of value.statuses) {
                const existingMessage = messageMap.get(status.id)
                if (existingMessage) {
                  existingMessage.status = status.status
                  existingMessage.statusUpdatedAt = new Date()
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

  // Write processed data to a JSON file
  const outputPath = path.join(process.cwd(), "processed_messages.json")
  fs.writeFileSync(outputPath, JSON.stringify(processedMessages, null, 2))

  // Display summary
  const conversations = [...new Set(processedMessages.map(msg => msg.conversationId))]

  console.log("\n=== Processing Complete ===")
  console.log(`Total messages processed: ${processedMessages.length}`)
  console.log(`Total conversations: ${conversations.length}`)
  console.log("Conversations:", conversations)
  console.log(`\n✅ Data saved to: ${outputPath}`)
  console.log("\nTo import into MongoDB:")
  console.log("1. Open MongoDB Compass")
  console.log("2. Connect to your cluster")
  console.log("3. Select the 'whatsapp' database")
  console.log("4. Create a collection called 'processed_messages'")
  console.log("5. Click 'Add Data' > 'Import File'")
  console.log("6. Select the processed_messages.json file")
  console.log("7. Choose JSON format and import")
}

processSampleDataLocal() 