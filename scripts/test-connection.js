const { MongoClient } = require("mongodb")
const dotenv = require("dotenv")

// Load environment variables from .env file
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"

console.log("Testing MongoDB connection...")
console.log("URI:", MONGODB_URI.replace(/\/\/.*@/, "//***:***@")) // Hide credentials

async function testConnection() {
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  })

  try {
    console.log("Attempting to connect...")
    await client.connect()
    console.log("✅ Successfully connected to MongoDB!")
    
    const db = client.db("whatsapp")
    const collections = await db.listCollections().toArray()
    console.log("Collections in whatsapp database:", collections.map(c => c.name))
    
    return true
  } catch (error) {
    console.error("❌ Connection failed:", error.message)
    console.error("Error details:", error)
    return false
  } finally {
    await client.close()
  }
}

testConnection() 