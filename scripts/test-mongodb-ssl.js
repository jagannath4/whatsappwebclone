const { MongoClient } = require("mongodb")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

async function testMongoDBWithSSL() {
  console.log("🔍 Testing MongoDB Connection with SSL options...")
  
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not found in .env file")
    return
  }

  // Try different connection options
  const connectionOptions = [
    {
      name: "Default",
      options: {}
    },
    {
      name: "With SSL options",
      options: {
        ssl: true,
        tls: true,
        tlsAllowInvalidCertificates: true,
        tlsAllowInvalidHostnames: true
      }
    },
    {
      name: "With timeout",
      options: {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 15000,
        socketTimeoutMS: 15000
      }
    }
  ]

  for (const config of connectionOptions) {
    console.log(`\n🔄 Trying: ${config.name}`)
    
    const client = new MongoClient(MONGODB_URI, config.options)

    try {
      await client.connect()
      console.log(`✅ ${config.name}: Connection successful!`)
      
      const db = client.db("whatsapp")
      const collections = await db.listCollections().toArray()
      console.log(`📁 Collections found: ${collections.length}`)
      
      await client.close()
      return true
      
    } catch (error) {
      console.log(`❌ ${config.name}: Failed - ${error.message}`)
      await client.close()
    }
  }
  
  return false
}

testMongoDBWithSSL() 