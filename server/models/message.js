// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message_id: { type: String, unique: true }, // messages[0].id
  from: String,                                // messages[0].from
  wa_id: String,                               // contacts[0].wa_id
  name: String,                                // contacts[0].profile.name
  text: String,                                // messages[0].text.body
  type: String,                                // messages[0].type
  timestamp: Date,                             // converted from Unix timestamp
  status: { type: String, default: 'sent' },   // updated by status payload
});

module.exports = mongoose.model('Message', messageSchema, 'processed_messages');
