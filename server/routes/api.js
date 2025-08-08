const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const { io } = require('../server'); // import the io you exported

// GET /api/chats - Get all chats
router.get('/chats', async (req, res) => {
  try {
    const messages = await Message.aggregate([
      {
        $group: {
          _id: '$wa_id',
          name: { $first: '$name' },
          lastMessage: {
            $top: {
              output: { 
                content: '$text', 
                timestamp: '$timestamp',
              },
              sortBy: { timestamp: -1 }
            }
          }
        }
      }
    ]);
    
    const chats = messages.map(msg => ({
      id: msg._id,
      name: msg.name,
      lastMessage: msg.lastMessage
    }));
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/chats/:chatId/messages - Get messages for a specific chat
router.get('/chats/:chatId/messages', async (req, res) => {
  try {
    const messages = await Message.find({ wa_id: req.params.chatId })
      .sort({ timestamp: 1 }); // Sort by timestamp in ascending order
    const formattedMessages = messages.map(msg => ({
      id: msg.message_id,
      chatId: msg.wa_id,
      content: msg.text,
      timestamp: msg.timestamp,
      isSent: msg.from === '918329446654',
      isRead: msg.status === 'read'
    }));
    res.json(formattedMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/messages - Send a new message
router.post('/messages', async (req, res) => {
  const { chatId, content } = req.body;
  try {
    const contact = await Message.findOne({ wa_id: chatId });
    if (!contact) {
      throw new Error('Contact not found');
    }

    const newMessage = new Message({
      message_id: Date.now().toString(),
      from: '918329446654',
      wa_id: chatId,
      name: contact.name,
      text: content,
      type: 'text',
      timestamp: new Date(),
      status: 'sent'
    });

    await newMessage.save();
    io.emit('newMessage', {
      id: newMessage.message_id,
      chatId: newMessage.wa_id,
      content: newMessage.text,
      timestamp: newMessage.timestamp,
      isSent: true,
      isRead: false
    });
    res.json({
      id: newMessage.message_id,
      chatId: newMessage.wa_id,
      content: newMessage.text,
      timestamp: newMessage.timestamp,
      isSent: true,
      isRead: false
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/webhook - Handle WhatsApp webhook payload
router.post('/webhook', async (req, res) => {
  try {
    const entry = req.body.entry[0];
    const change = entry.changes[0].value;
    const contact = change.contacts[0];
    const message = change.messages[0];

    const newMessage = new Message({
      message_id: message.id,
      from: message.from,
      wa_id: contact.wa_id,
      name: contact.profile.name,
      text: message.text.body,
      type: message.type,
      timestamp: new Date(parseInt(message.timestamp) * 1000),
      status: 'sent'
    });

    await newMessage.save();
    res.json({ 
      success: true, 
      message: 'Webhook processed successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// GET /api/contacts - Get all contacts (same as chats for this implementation)
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await Message.aggregate([
      {
        $group: {
          _id: '$wa_id',
          name: { $first: '$name' },
          lastMessage: {
            $top: {
              output: { content: '$text', timestamp: '$timestamp' },
              sortBy: { timestamp: -1 }
            }
          }
        }
      }
    ]);
    
    res.json(contacts.map(contact => ({
      id: contact._id,
      name: contact.name,
      lastMessage: contact.lastMessage
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/chats/:chatId/read - Mark chat as read
router.put('/chats/:chatId/read', async (req, res) => {
  try {
    await Message.updateMany(
      { wa_id: req.params.chatId, status: 'sent' },
      { $set: { status: 'read' } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/user/status - Get user online status
router.get('/user/status/:userId', async (req, res) => {
  try {
    res.json({ 
      isOnline: Math.random() > 0.5, 
      lastSeen: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
