"use client"

import { Search, MoreVertical, MessageCircle } from "lucide-react"
import type { Conversation } from "@/types"
import { formatTime } from "@/lib/utils"

interface ChatSidebarProps {
  conversations: Conversation[]
  selectedConversation: string | null
  onSelectConversation: (id: string) => void
}

export function ChatSidebar({ conversations, selectedConversation, onSelectConversation }: ChatSidebarProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gray-100 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-medium text-gray-800">Chats</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-200 rounded-full">
              <MessageCircle className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-full">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No conversations yet</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                selectedConversation === conversation.id ? "bg-gray-100" : ""
              }`}
            >
              {/* Avatar */}
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-white font-medium text-lg">
                  {conversation.contact.name.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Chat info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900 truncate">{conversation.contact.name}</h3>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatTime(conversation.lastMessage?.timestamp)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage?.text || "No messages yet"}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
