import { MongoClient, ServerApiVersion, type Db } from "mongodb"

// Lazily initialize the MongoDB client to avoid throwing during import time
let clientPromise: Promise<MongoClient> | null = null

function createMongoClient(uri: string): MongoClient {
  return new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    // Additional options for better compatibility
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
}

function getClientPromise(): Promise<MongoClient> {
  if (clientPromise) return clientPromise

  const uri = process.env.MONGODB_URI
  if (!uri) {
    // Do not throw at import/build time; callers should handle missing env
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }

  const client = createMongoClient(uri)

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    clientPromise = client.connect()
  }

  return clientPromise
}

export async function getDatabase(): Promise<Db> {
  const client = await getClientPromise()
  return client.db("whatsapp")
}

// Test connection function
export async function testConnection(): Promise<boolean> {
  // If no URI, treat as not connected and let callers fallback to mock data
  if (!process.env.MONGODB_URI) {
    return false
  }

  try {
    const client = await getClientPromise()
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 })
    return true
  } catch (error) {
    return false
  }
}

export default getClientPromise
