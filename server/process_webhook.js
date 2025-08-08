const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Message = require('./models/message.js');

const FOLDER_PATH = path.join(__dirname, 'webhook api');

mongoose.connect(process.env.MONGODB_URI + '/WhatsApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

async function processFile(filePath) {
  const content = fs.readFileSync(filePath);
  const data = JSON.parse(content);

  const entries = data.metaData?.entry || [];

  for (const entry of entries) {
    for (const change of entry.changes || []) {
      const value = change.value;

      // New message
      if (value.messages && value.contacts) {
        const message = value.messages[0];
        const contact = value.contacts[0];

        const doc = {
          message_id: message.id,
          from: message.from,
          wa_id: contact.wa_id,
          name: contact.profile?.name || '',
          text: message.text?.body || '',
          type: message.type,
          timestamp: new Date(parseInt(message.timestamp) * 1000),
          status: 'sent',
        };

        try {
          await Message.updateOne(
            { message_id: doc.message_id },
            { $setOnInsert: doc },
            { upsert: true }
          );
          console.log(`✅ Inserted or skipped message: ${doc.message_id}`);
        } catch (err) {
          console.error(`❌ Error inserting message: ${err.message}`);
        }
      }

      // Status update
      if (value.statuses) {
        for (const status of value.statuses) {
          try {
            await Message.updateOne(
              { message_id: status.meta_msg_id || status.id },
              {
                $set: {
                  status: status.status,
                  timestamp: new Date(parseInt(status.timestamp) * 1000)
                }
              }
            );
            console.log(`🔄 Updated status for: ${status.meta_msg_id || status.id}`);
          } catch (err) {
            console.error(`❌ Error updating status: ${err.message}`);
          }
        }
      }
    }
  }
}

async function main() {
  const files = fs.readdirSync(FOLDER_PATH).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const fullPath = path.join(FOLDER_PATH, file);
    console.log(`📂 Processing: ${file}`);
    await processFile(fullPath);
  }

  console.log('✅ All files processed.');
  mongoose.connection.close();
}

main();
