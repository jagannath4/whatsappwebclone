import type { NextRequest } from "next/server"
import { Server as SocketIOServer } from "socket.io"
import type { Server as NetServer } from "http"

export const config = {
  api: {
    bodyParser: false,
  },
}

let io: SocketIOServer

export async function GET(req: NextRequest) {
  if (!io) {
    const httpServer: NetServer = (req as any).socket.server
    io = new SocketIOServer(httpServer, {
      path: "/api/socket",
      addTrailingSlash: false,
    })

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id)

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id)
      })
    })
  }

  return new Response("Socket.IO server initialized", { status: 200 })
}
