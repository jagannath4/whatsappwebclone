const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

// Prepare the Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Initialize Socket.IO server
  const io = new Server(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    transports: ["polling", "websocket"]
  })

  // Socket.IO event handlers
  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id)
    
    socket.on('join-conversation', (conversationId) => {
      socket.join(conversationId)
      console.log(`👥 User joined conversation: ${conversationId}`)
    })
    
    socket.on('leave-conversation', (conversationId) => {
      socket.leave(conversationId)
      console.log(`👋 User left conversation: ${conversationId}`)
    })
    
    socket.on('new-message', (message) => {
      console.log('💬 New message received:', message.text)
      socket.to(message.conversationId).emit('new-message', message)
      socket.emit('message-sent', message)
    })
    
    socket.on('status-update', (update) => {
      console.log(`📊 Status update: ${update.messageId} -> ${update.status}`)
      socket.to(update.conversationId).emit('message-status-update', update)
      socket.emit('message-status-update', update)
    })
    
    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id)
    })
  })

  server.listen(port, () => {
    console.log(`🚀 Ready on http://${hostname}:${port}`)
    console.log('🔌 Socket.IO server initialized')
  })
}) 