# WhatsApp Web Clone

A real-time messaging application built with React, TypeScript, and Node.js that mimics the core functionality and UI of WhatsApp Web.

🌐 **Live Demo:** [https://whats-app-web-clone-eta-azure.vercel.app](https://whats-app-web-clone-eta-azure.vercel.app)

## Features

- 💬 Real-time messaging using Socket.IO
- 📱 Responsive design for all screen sizes
- ✅ Message read receipts
- 🕒 Message timestamps
- 🔍 Chat search functionality
- 📝 Message history
- 👤 Contact list with last message preview

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Socket.IO Client for real-time communication
- date-fns for date formatting
- Lucide Icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.IO for real-time messaging
- CORS for cross-origin support

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance
- Git

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd WhatsApp Clone
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd server
npm install
```

4. Set up environment variables

Frontend (.env):
```
VITE_BACKEND_URL=http://localhost:5000
```

Backend (server/.env):
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
HOST_URL=http://localhost:8080
```

5. Start the development servers

Backend:
```bash
cd server
npm start
```

Frontend:
```bash
# In another terminal, from the project root
npm run dev
```

## Project Structure

```
WhatsApp Clone/
├── src/                    # Frontend source code
│   ├── api/               # API integration
│   ├── components/        # React components
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── hooks/            # Custom React hooks
├── server/                # Backend source code
│   ├── models/           # MongoDB models
│   └── routes/           # API routes
└── public/               # Static assets
```

## Features in Detail

### Real-time Messaging
- Messages are delivered instantly using Socket.IO
- Message status updates (sent/delivered/read)
- Typing indicators

### User Interface
- Clean and modern WhatsApp-like design
- Responsive layout that works on all devices
- Message bubbles with timestamps
- Read receipts (tick marks)
- Chat list with message previews
- Search functionality

### Data Management
- MongoDB for persistent storage
- Real-time updates using Socket.IO
- Message history with infinite scroll
- Chat organization and preview

## Acknowledgments

- WhatsApp Web for design inspiration
- React and Node.js communities for excellent documentation and tools
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- Tailwind CSS

