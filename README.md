# 📱 WhatsApp Web Clone

A real-time WhatsApp Web clone built with Next.js, MongoDB, and Socket.IO. This application demonstrates modern web development practices with real-time messaging capabilities.

## ✨ Features

- **📱 WhatsApp Web UI** - Authentic WhatsApp Web interface
- **💬 Real-time Messaging** - Live message updates using WebSocket
- **📊 Message Status** - Real-time status updates (sent → delivered → read)
- **📱 Responsive Design** - Works perfectly on mobile and desktop
- **🔌 WebSocket Integration** - Real-time communication
- **🗄️ MongoDB Integration** - Persistent data storage
- **🎨 Modern UI** - Clean, professional design

## 🚀 Live Demo

[Deploy your own instance](#deployment) or visit the live demo (coming soon)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Real-time**: Socket.IO
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd whatsappsamplepayloads
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/whatsapp?retryWrites=true&w=majority
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── conversations/ # Conversations API
│   │   ├── messages/      # Messages API
│   │   ├── send-message/  # Send message API
│   │   └── socket/        # WebSocket server
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── chat-sidebar.tsx   # Conversation sidebar
│   ├── chat-window.tsx    # Main chat window
│   ├── message-bubble.tsx # Individual message component
│   └── real-time-indicator.tsx # Connection status
├── hooks/                 # Custom React hooks
│   └── use-socket.ts      # WebSocket hook
├── lib/                   # Utility libraries
│   ├── mongodb.ts         # MongoDB connection
│   └── socket-server.ts   # WebSocket server setup
├── scripts/               # Utility scripts
│   ├── process-sample-data.js # Data processing
│   └── test-mongodb-official.js # MongoDB testing
└── types/                 # TypeScript type definitions
```

## 🔧 API Endpoints

### Conversations
- `GET /api/conversations` - Get all conversations

### Messages
- `GET /api/messages/[conversationId]` - Get messages for a conversation
- `POST /api/send-message` - Send a new message

### WebSocket
- `GET /api/socket` - WebSocket server endpoint

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Set Environment Variables**
In your Vercel dashboard, add:
- `MONGODB_URI`: Your MongoDB connection string

### Deploy to Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables

### Deploy to Heroku

1. Create a Heroku app
2. Connect your GitHub repository
3. Add environment variables in Heroku dashboard
4. Deploy

## 🧪 Testing

### Test MongoDB Connection
```bash
node scripts/test-mongodb-official.js
```

### Test WebSocket
Visit `http://localhost:3000/websocket-test.html` in your browser

### Test Real-time Features
1. Open the app in multiple browser tabs
2. Send messages in one tab
3. Watch them appear in real-time in other tabs

## 📊 Features in Detail

### Real-time Messaging
- Messages appear instantly without page refresh
- Cross-tab synchronization
- Live status updates

### Message Status
- **Sent** - Message sent to server
- **Delivered** - Message delivered to recipient
- **Read** - Message read by recipient

### Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interface

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- WhatsApp for the UI inspiration
- Next.js team for the amazing framework
- MongoDB team for the database
- Socket.IO team for real-time capabilities

---

**Built with ❤️ using Next.js, MongoDB, and Socket.IO** 