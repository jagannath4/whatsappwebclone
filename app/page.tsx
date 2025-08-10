"use client"

import { useState, useEffect } from "react"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatWindow } from "@/components/chat-window"
import { useSocket } from "@/hooks/use-socket"
import type { Conversation, Message } from "@/types"

export default function WhatsAppClone() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const { socket, isConnected, connectionError, joinConversation, leaveConversation, sendMessage, updateStatus } = useSocket()

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
      // Join the conversation room for real-time updates
      joinConversation(selectedConversation)
    } else {
      // Leave the previous conversation room
      if (selectedConversation) {
        leaveConversation(selectedConversation)
      }
    }

    return () => {
      if (selectedConversation) {
        leaveConversation(selectedConversation)
      }
    }
  }, [selectedConversation, joinConversation, leaveConversation])

  // Real-time message updates
  useEffect(() => {
    if (!socket) return

    // Listen for new messages
    socket.on("new-message", (message: Message) => {
      console.log("💬 Real-time: New message received", message.text)
      if (message.conversationId === selectedConversation) {
        setMessages((prev) => [...prev, message])
      }
      // Update conversation list to show new last message
      fetchConversations()
    })

    // Listen for message status updates
    socket.on("message-status-update", (update: { messageId: string; status: string }) => {
      console.log("📊 Real-time: Status update", update)
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === update.messageId ? { ...msg, status: update.status } : msg
        )
      )
    })

    // Listen for message sent confirmation
    socket.on("message-sent", (message: Message) => {
      console.log("✅ Real-time: Message sent confirmation", message.text)
      // You can add visual feedback here
    })

    return () => {
      socket.off("new-message")
      socket.off("message-status-update")
      socket.off("message-sent")
    }
  }, [socket, selectedConversation])

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/conversations")
      const data = await response.json()
      setConversations(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching conversations:", error)
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages/${conversationId}`)
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const handleSendMessage = async (text: string) => {
    if (!selectedConversation) return

    const selectedConv = conversations.find((c) => c.id === selectedConversation)
    if (!selectedConv) return

    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: selectedConversation,
          recipientId: selectedConv.contact.wa_id,
          text,
        }),
      })

      if (response.ok) {
        const newMessage = await response.json()
        
        // Add message to local state immediately
        setMessages((prev) => [...prev, newMessage])
        
        // Send via WebSocket for real-time updates
        sendMessage(newMessage)
        
        // Update conversation list
        fetchConversations()
        
        // Simulate status updates (sent -> delivered -> read)
        setTimeout(() => {
          updateStatus(newMessage.id, "delivered", selectedConversation)
        }, 1000)
        
        setTimeout(() => {
          updateStatus(newMessage.id, "read", selectedConversation)
        }, 3000)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading WhatsApp Clone...</p>
          <div className="mt-2 text-sm text-gray-500">
            {isConnected ? "🔌 Connected" : connectionError ? "🔌 Connection failed" : "🔌 Connecting..."}
          </div>
        </div>
      </div>
    )
  }

  const selectedConv = conversations.find((c) => c.id === selectedConversation)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200">
        <ChatSidebar
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 hidden md:block">
        {selectedConv ? (
          <ChatWindow
            conversation={selectedConv}
            messages={messages}
            onSendMessage={handleSendMessage}
            isConnected={isConnected}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to WhatsApp Clone</h2>
              <p className="text-gray-600">Select a conversation to start messaging</p>
              <div className="mt-4 text-sm text-gray-500">
                {isConnected ? "🔌 Real-time connected" : connectionError ? "🔌 Real-time unavailable" : "🔌 Connecting..."}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Chat Overlay */}
      {selectedConv && (
        <div className="fixed inset-0 z-50 md:hidden">
          <ChatWindow
            conversation={selectedConv}
            messages={messages}
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedConversation(null)}
            isMobile
            isConnected={isConnected}
          />
        </div>
      )}
    </div>
  )
}
