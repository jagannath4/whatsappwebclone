const { io } = require("socket.io-client")

console.log("🧪 Testing Real-time WebSocket Functionality...")

// Connect to the WebSocket server
const socket = io("http://localhost:3000", {
  path: "/api/socket"
})

socket.on("connect", () => {
  console.log("✅ Connected to WebSocket server!")
  
  // Join a conversation
  const conversationId = "919937320320_629305560276479"
  socket.emit("join-conversation", conversationId)
  console.log(`👥 Joined conversation: ${conversationId}`)
  
  // Simulate sending a message
  setTimeout(() => {
    const testMessage = {
      id: `test_${Date.now()}`,
      conversationId: conversationId,
      from: "918329446654",
      text: "This is a real-time test message! 🚀",
      timestamp: Math.floor(Date.now() / 1000),
      status: "sent",
      type: "text"
    }
    
    console.log("💬 Sending test message:", testMessage.text)
    socket.emit("new-message", testMessage)
    
    // Simulate status updates
    setTimeout(() => {
      console.log("📊 Updating status to 'delivered'")
      socket.emit("status-update", {
        messageId: testMessage.id,
        status: "delivered",
        conversationId: conversationId
      })
    }, 2000)
    
    setTimeout(() => {
      console.log("📊 Updating status to 'read'")
      socket.emit("status-update", {
        messageId: testMessage.id,
        status: "read",
        conversationId: conversationId
      })
    }, 4000)
    
  }, 1000)
})

socket.on("message-sent", (message) => {
  console.log("✅ Message sent confirmation received:", message.text)
})

socket.on("message-status-update", (update) => {
  console.log("📊 Status update received:", update)
})

socket.on("disconnect", () => {
  console.log("🔌 Disconnected from WebSocket server")
})

// Clean up after 10 seconds
setTimeout(() => {
  console.log("🧹 Cleaning up...")
  socket.disconnect()
  process.exit(0)
}, 10000) 