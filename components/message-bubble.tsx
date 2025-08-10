"use client"

import { useState, useEffect } from "react"
import { Check, CheckCheck } from "lucide-react"
import type { Message } from "@/types"

interface MessageBubbleProps {
  message: Message
  isOwnMessage: boolean
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  const [status, setStatus] = useState(message.status)

  // Update status when message.status changes (for real-time updates)
  useEffect(() => {
    setStatus(message.status)
  }, [message.status])

  const getStatusIcon = () => {
    switch (status) {
      case "sent":
        return <Check className="w-3 h-3 text-gray-400" />
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-gray-400" />
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "sent":
        return "sent"
      case "delivered":
        return "delivered"
      case "read":
        return "read"
      default:
        return "sending..."
    }
  }

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
          isOwnMessage
            ? "bg-green-500 text-white rounded-br-md"
            : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
        }`}
      >
        <div className="text-sm">{message.text}</div>
        <div className={`flex items-center justify-end mt-1 space-x-1 ${isOwnMessage ? "text-green-100" : "text-gray-500"}`}>
          <span className="text-xs">
            {new Date(message.timestamp * 1000).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isOwnMessage && (
            <div className="flex items-center space-x-1">
              {getStatusIcon()}
              <span className="text-xs opacity-75">{getStatusText()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
