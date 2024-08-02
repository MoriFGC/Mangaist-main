import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { authMiddleware } from '../middlewares/authMiddlewares.js';

const router = express.Router();

// Funzione di utilità per convertire stringhe in ObjectId
const toObjectId = (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id);
  }
  return null;
};

// Invia un messaggio
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const message = new Message({
      sender: req.user._id,
      recipient: recipientId,
      content
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(400).json({ message: error.message });
  }
});

// Ottieni conversazioni dell'utente
router.get('/conversations', authMiddleware, async (req, res) => {
    try {
      console.log('User ID:', req.user._id);
      
      const userId = toObjectId(req.user._id);
      if (!userId) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      // Verifica il tipo di dato nel database
      const sampleMessage = await Message.findOne({ $or: [{ sender: userId }, { recipient: userId }] });
      console.log('Sample message:', sampleMessage);
  
      // Query semplificata
      const messages = await Message.find({
        $or: [{ sender: userId }, { recipient: userId }]
      }).sort({ timestamp: -1 });
  
      console.log('Messages found:', messages.length);
  
      // Aggregazione semplificata
      const conversations = await Message.aggregate([
        {
          $match: {
            $or: [{ sender: userId }, { recipient: userId }]
          }
        },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ['$sender', userId] },
                '$recipient',
                '$sender'
              ]
            },
            lastMessage: { $last: '$$ROOT' }
          }
        }
      ]);
  
      console.log('Conversations:', JSON.stringify(conversations, null, 2));
  
      res.json(conversations);
    } catch (error) {
      console.error('Error in /conversations:', error);
      res.status(500).json({ message: error.message, stack: error.stack });
    }
  });

// Ottieni messaggi di una conversazione specifica
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = toObjectId(req.user._id);
    const otherUserId = toObjectId(req.params.userId);

    if (!userId || !otherUserId) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Error getting conversation messages:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;