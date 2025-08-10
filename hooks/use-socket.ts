"use client"

import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

interface UseSocketReturn {
  socket: Socket | null
  isConnected: boolean
  connectionError: string | null
  joinConversation: (conversationId: string) => void
  leaveConversation: (conversationId: string) => void
  sendMessage: (message: any) => void
  updateStatus: (update: { messageId: string; status: string; conversationId: string }) => void
}

export function useSocket(): UseSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useEffect(() => {
    // Temporarily disable Socket.IO for now
    console.log("🔌 Socket.IO temporarily disabled for development")
    setIsConnected(false)
    setConnectionError("Real-time features temporarily disabled")
    
    // Mock connection for development
    const mockSocket = {
      emit: (event: string, data: any) => {
        console.log(`Mock emit: ${event}`, data)
        // Simulate real-time updates
        if (event === 'new-message') {
          setTimeout(() => {
            // Simulate message being sent
            console.log('Mock: Message sent successfully')
          }, 500)
        }
      },
      on: (event: string, callback: any) => {
        console.log(`Mock listener added: ${event}`)
      },
      off: (event: string) => {
        console.log(`Mock listener removed: ${event}`)
      }
    } as any

    setSocket(mockSocket)
    setIsConnected(true)
    setConnectionError(null)

    return () => {
      console.log("🔌 Mock socket cleanup")
    }
  }, [])

  const joinConversation = (conversationId: string) => {
    if (socket) {
      socket.emit('join-conversation', conversationId)
      console.log(`👥 Mock: Joined conversation ${conversationId}`)
    }
  }

  const leaveConversation = (conversationId: string) => {
    if (socket) {
      socket.emit('leave-conversation', conversationId)
      console.log(`👋 Mock: Left conversation ${conversationId}`)
    }
  }

  const sendMessage = (message: any) => {
    if (socket) {
      socket.emit('new-message', message)
      console.log('💬 Mock: Sending message', message.text)
    }
  }

  const updateStatus = (update: { messageId: string; status: string; conversationId: string }) => {
    if (socket) {
      socket.emit('status-update', update)
      console.log('📊 Mock: Updating status', update)
    }
  }

  return {
    socket,
    isConnected,
    connectionError,
    joinConversation,
    leaveConversation,
    sendMessage,
    updateStatus
  }
}
