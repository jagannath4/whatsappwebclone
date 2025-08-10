"use client"

import { useState, useEffect } from "react"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatWindow } from "@/components/chat-window"
import type { Conversation, Message } from "@/types"

export default function WhatsAppClone() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
    }
  }, [selectedConversation])

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
        setMessages((prev) => [...prev, newMessage])
        fetchConversations() // Update last message in sidebar
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
          />
        </div>
      )}
    </div>
  )
}
