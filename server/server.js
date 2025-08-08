const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const {Server} = require('socket.io');
const Message = require('./models/message');
// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.HOST_URL, 

}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB WhatsApp database successfully');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Routes
app.use('/api', require('./routes/api'));
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Konnect AI API' });
});

// Start server
const PORT = process.env.PORT || 5000;
const httpServer=app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const io = new Server(httpServer, {
  cors: {
    origin: process.env.HOST_URL 
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});


// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
Message.watch().on('change', (change) => {
  if (change.operationType === 'insert') {
    const doc = change.fullDocument;
    io.emit('newMessage', {
      id: doc.message_id,
      chatId: doc.wa_id,
      content: doc.text,
      timestamp: doc.timestamp,
      isSent: doc.from === '918329446654',
      isRead: doc.status === 'read'
    });
  }
});
module.exports.io = io;

