const { MongoClient } = require("mongodb")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

async function testMongoDB() {
  console.log("🔍 Testing MongoDB Connection...")
  console.log("URI:", MONGODB_URI ? MONGODB_URI.replace(/\/\/.*@/, "//***:***@") : "Not found")
  
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not found in .env file")
    return
  }

  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  })

  try {
    console.log("📡 Attempting to connect...")
    await client.connect()
    console.log("✅ Successfully connected to MongoDB!")
    
    const db = client.db("whatsapp")
    console.log("📊 Database: whatsapp")
    
    // List collections
    const collections = await db.listCollections().toArray()
    console.log("📁 Collections:", collections.map(c => c.name))
    
    // Test the processed_messages collection
    const collection = db.collection("processed_messages")
    
    // Count documents
    const count = await collection.countDocuments()
    console.log(`📈 Total messages in processed_messages: ${count}`)
    
    // Get a sample document
    const sample = await collection.findOne()
    if (sample) {
      console.log("📄 Sample document:", {
        id: sample.id,
        conversationId: sample.conversationId,
        text: sample.text?.substring(0, 50) + "...",
        status: sample.status
      })
    } else {
      console.log("📄 No documents found in processed_messages")
    }
    
    // Test insert operation
    const testDoc = {
      id: `test_${Date.now()}`,
      conversationId: "test_conversation",
      from: "test_user",
      text: "This is a test message",
      timestamp: Math.floor(Date.now() / 1000),
      status: "sent",
      type: "text",
      createdAt: new Date(),
      isTest: true
    }
    
    console.log("🧪 Testing insert operation...")
    const insertResult = await collection.insertOne(testDoc)
    console.log("✅ Insert successful:", insertResult.insertedId)
    
    // Clean up test document
    await collection.deleteOne({ isTest: true })
    console.log("🧹 Test document cleaned up")
    
    return true
    
  } catch (error) {
    console.error("❌ MongoDB connection failed:")
    console.error("Error:", error.message)
    
    if (error.message.includes("SSL")) {
      console.log("\n💡 SSL Issue detected. This is common on Windows.")
      console.log("💡 Try deploying to cloud (Vercel/Render) where SSL works better.")
    }
    
    return false
  } finally {
    await client.close()
  }
}

testMongoDB() 