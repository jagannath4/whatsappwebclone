"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Phone, Video, MoreVertical, Send, Smile, Paperclip, Mic } from "lucide-react"
import type { Conversation, Message } from "@/types"
import { MessageBubble } from "./message-bubble"

interface ChatWindowProps {
  conversation: Conversation
  messages: Message[]
  onSendMessage: (text: string) => void
  onBack?: () => void
  isMobile?: boolean
}

export function ChatWindow({ conversation, messages, onSendMessage, onBack, isMobile }: ChatWindowProps) {
  const [messageText, setMessageText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText.trim())
      setMessageText("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gray-100 p-4 border-b border-gray-200 flex items-center">
        {isMobile && onBack && (
          <button onClick={onBack} className="mr-3 p-1 hover:bg-gray-200 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* Contact info */}
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
          <span className="text-white font-medium">{conversation.contact.name.charAt(0).toUpperCase()}</span>
        </div>

        <div className="flex-1">
          <h2 className="font-medium text-gray-900">{conversation.contact.name}</h2>
          <p className="text-sm text-gray-500">+{conversation.contact.wa_id}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const showDate =
              index === 0 ||
              new Date(message.timestamp * 1000).toDateString() !==
                new Date(messages[index - 1].timestamp * 1000).toDateString()

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="text-center my-4">
                    <span className="bg-white px-3 py-1 rounded-lg text-xs text-gray-600 shadow-sm">
                      {new Date(message.timestamp * 1000).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
                <MessageBubble message={message} />
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="bg-gray-100 p-4 border-t border-gray-200">
        <div className="flex items-end space-x-2">
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <Smile className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex-1 bg-white rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message"
              className="w-full p-3 resize-none focus:outline-none rounded-lg max-h-32"
              rows={1}
              style={{ minHeight: "44px" }}
            />
          </div>

          {messageText.trim() ? (
            <button onClick={handleSend} className="p-2 bg-green-500 hover:bg-green-600 rounded-full text-white">
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button className="p-2 hover:bg-gray-200 rounded-full">
              <Mic className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
