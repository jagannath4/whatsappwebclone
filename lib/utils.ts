import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(timestamp: number | string): string {
  const date = new Date(typeof timestamp === "string" ? Number.parseInt(timestamp) * 1000 : timestamp * 1000)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (messageDate.getTime() === today.getTime()) {
    // Today - show time
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  } else if (messageDate.getTime() === today.getTime() - 24 * 60 * 60 * 1000) {
    // Yesterday
    return "Yesterday"
  } else if (date.getFullYear() === now.getFullYear()) {
    // This year - show month and day
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  } else {
    // Different year - show full date
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
}
