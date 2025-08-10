import { Check, CheckCheck } from "lucide-react"
import type { Message } from "@/types"
import { formatTime } from "@/lib/utils"

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isOutgoing = message.from === "918329446654" // Business phone number

  const getStatusIcon = () => {
    if (!isOutgoing) return null

    switch (message.status) {
      case "sent":
        return <Check className="w-4 h-4 text-gray-400" />
      case "delivered":
        return <CheckCheck className="w-4 h-4 text-gray-400" />
      case "read":
        return <CheckCheck className="w-4 h-4 text-blue-500" />
      default:
        return <Check className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className={`flex ${isOutgoing ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOutgoing ? "bg-green-500 text-white" : "bg-white text-gray-900 shadow-sm"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
        <div
          className={`flex items-center justify-end mt-1 space-x-1 ${isOutgoing ? "text-green-100" : "text-gray-500"}`}
        >
          <span className="text-xs">{formatTime(message.timestamp)}</span>
          {getStatusIcon()}
        </div>
      </div>
    </div>
  )
}
