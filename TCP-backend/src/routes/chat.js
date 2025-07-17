const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateUser } = require('../middleware/auth');
const { Chat } = require('../models/Chat');

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Get user's chats
router.get('/', chatController.getUserChats);

// Get team chat messages (special route)
router.get('/team-chat/messages', async (req, res) => {
  try {
    const teamChat = await Chat.findOne({ type: 'team' });
    if (!teamChat) {
      return res.status(404).json({
        success: false,
        message: 'Team chat not found'
      });
    }
    
    // Forward to regular message retrieval with team chat ID
    req.params.chatId = teamChat._id;
    return chatController.getChatMessages(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send message to team chat (special route)
router.post('/team-chat/messages', async (req, res) => {
  try {
    const teamChat = await Chat.findOne({ type: 'team' });
    if (!teamChat) {
      return res.status(404).json({
        success: false,
        message: 'Team chat not found'
      });
    }
    
    // Forward to regular message sending with team chat ID
    req.params.chatId = teamChat._id;
    return chatController.sendMessage(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get chat messages
router.get('/:chatId/messages', chatController.getChatMessages);

// Create new chat
router.post('/', chatController.createChat);

// Send message
router.post('/:chatId/messages', chatController.sendMessage);

// Update message
router.put('/messages/:messageId', chatController.updateMessage);

// Delete message
router.delete('/messages/:messageId', chatController.deleteMessage);

// Add reaction to message
router.post('/messages/:messageId/reactions', chatController.addReaction);

module.exports = router; 