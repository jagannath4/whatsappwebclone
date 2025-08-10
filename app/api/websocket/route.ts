import type { NextRequest } from "next/server"

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function GET(req: NextRequest) {
  try {
    // Simple WebSocket test endpoint
    return new Response("WebSocket endpoint ready", { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  } catch (error) {
    console.error("❌ Error in WebSocket API route:", error)
    return new Response("WebSocket server error", { status: 500 })
  }
} 