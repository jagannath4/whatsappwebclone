const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI not found in .env file");
  process.exit(1);
}

console.log("🔍 Testing MongoDB Connection with Official Driver...");
console.log("URI:", uri.replace(/\/\/.*@/, "//***:***@"));

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

async function run() {
  try {
    console.log("📡 Attempting to connect...");
    
    // Connect the client to the server
    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");
    
    // Test the whatsapp database
    const db = client.db("whatsapp");
    console.log("📊 Database: whatsapp");
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log("📁 Collections:", collections.map(c => c.name));
    
    // Test the processed_messages collection
    const collection = db.collection("processed_messages");
    
    // Count documents
    const count = await collection.countDocuments();
    console.log(`📈 Total messages in processed_messages: ${count}`);
    
    // Get a sample document
    const sample = await collection.findOne();
    if (sample) {
      console.log("📄 Sample document:", {
        id: sample.id,
        conversationId: sample.conversationId,
        text: sample.text?.substring(0, 50) + "...",
        status: sample.status
      });
    } else {
      console.log("📄 No documents found in processed_messages");
    }
    
    // Test insert operation
    const testDoc = {
      id: `test_${Date.now()}`,
      conversationId: "test_conversation",
      from: "test_user",
      text: "This is a test message using official driver",
      timestamp: Math.floor(Date.now() / 1000),
      status: "sent",
      type: "text",
      createdAt: new Date(),
      isTest: true
    };
    
    console.log("🧪 Testing insert operation...");
    const insertResult = await collection.insertOne(testDoc);
    console.log("✅ Insert successful:", insertResult.insertedId);
    
    // Clean up test document
    await collection.deleteOne({ isTest: true });
    console.log("🧹 Test document cleaned up");
    
    return true;
    
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error("Error:", error.message);
    
    if (error.message.includes("SSL")) {
      console.log("\n💡 SSL Issue detected. This is common on Windows.");
      console.log("💡 Try deploying to cloud (Vercel/Render) where SSL works better.");
    }
    
    return false;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir); 