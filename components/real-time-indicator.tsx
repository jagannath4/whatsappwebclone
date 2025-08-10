"use client"

import { Wifi, WifiOff, Clock } from "lucide-react"

interface RealTimeIndicatorProps {
  isConnected: boolean
}

export function RealTimeIndicator({ isConnected }: RealTimeIndicatorProps) {
  return (
    <div className={`flex items-center space-x-1 text-xs ${
      isConnected ? "text-green-600" : "text-orange-500"
    }`}>
      {isConnected ? (
        <>
          <Wifi className="w-3 h-3" />
          <span>Live</span>
        </>
      ) : (
        <>
          <Clock className="w-3 h-3" />
          <span>Mock Mode</span>
        </>
      )}
    </div>
  )
} 