const { Chat, ChatMessage } = require('../models/Chat');
const User = require('../models/User');

// Get all chats for a user
exports.getUserChats = async (req, res) => {
  try {
    // For team chat, include all chats where user is a participant OR chat is team type
    const chats = await Chat.find({
      $or: [
        { 'participants.user': req.user.userId },
        { type: 'team' }
      ]
    })
    .populate('participants.user', 'name email')
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'sender',
        select: 'name email'
      }
    })
    .sort({ lastActivity: -1 });

    res.json({
      success: true,
      data: chats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get chat messages
exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify user has access to this chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Allow access if it's a team chat or user is a participant
    if (chat.type !== 'team' && !chat.participants.some(p => p.user.equals(req.user.userId))) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const messages = await ChatMessage.find({ chat: chatId })
      .populate('sender', 'name email')
      .populate('mentions', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ChatMessage.countDocuments({ chat: chatId });

    res.json({
      success: true,
      data: messages,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new chat
exports.createChat = async (req, res) => {
  try {
    const { name, type, participants = [], project } = req.body;

    // Validate chat type
    if (!['direct', 'group', 'project', 'team'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid chat type'
      });
    }

    // For team chat, check if one already exists
    if (type === 'team') {
      const existingTeamChat = await Chat.findOne({ type: 'team' });
      if (existingTeamChat) {
        // If team chat exists, add current user if not already a participant
        if (!existingTeamChat.participants.some(p => p.user.equals(req.user.userId))) {
          existingTeamChat.participants.push({
            user: req.user.userId,
            role: 'member'
          });
          await existingTeamChat.save();
        }
        
        await existingTeamChat.populate('participants.user', 'name email');
        return res.json({
          success: true,
          message: 'Added to existing team chat',
          data: existingTeamChat
        });
      }
    }

    // For team chat, include all users
    let chatParticipants = [];
    if (type === 'team') {
      const allUsers = await User.find({}, '_id');
      chatParticipants = allUsers.map(user => ({ 
        user: user._id, 
        role: user._id.equals(req.user.userId) ? 'owner' : 'member' 
      }));
    } else {
      // For other chat types, use provided participants
      chatParticipants = [
        { user: req.user.userId, role: 'owner' },
        ...participants.map(userId => ({ user: userId, role: 'member' }))
      ];
    }

    // Create chat
    const chat = new Chat({
      name,
      type,
      project,
      participants: chatParticipants
    });

    await chat.save();
    await chat.populate('participants.user', 'name email');

    // For team chat, create a welcome message
    if (type === 'team') {
      const welcomeMessage = new ChatMessage({
        chat: chat._id,
        sender: req.user.userId,
        content: 'Welcome to the team chat! 👋',
        type: 'system'
      });
      await welcomeMessage.save();
      chat.lastMessage = welcomeMessage._id;
      await chat.save();
    }

    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      data: chat
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, type = 'text', mentions = [], replyTo, attachments = [] } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Allow sending if it's a team chat or user is a participant
    if (chat.type !== 'team' && !chat.participants.some(p => p.user.equals(req.user.userId))) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this chat'
      });
    }

    const message = new ChatMessage({
      chat: chatId,
      sender: req.user.userId,
      content,
      type,
      mentions,
      replyTo,
      attachments
    });

    await message.save();
    await message.populate('sender', 'name email');
    await message.populate('mentions', 'name email');

    // Update chat's last message and activity
    chat.lastMessage = message._id;
    chat.lastActivity = new Date();
    await chat.save();

    // Return populated message for socket broadcast
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update message
exports.updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await ChatMessage.findOne({
      _id: messageId,
      sender: req.user.userId,
      isDeleted: false
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or you are not the sender'
      });
    }

    message.content = content;
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    res.json({
      success: true,
      message: 'Message updated successfully',
      data: message
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await ChatMessage.findOne({
      _id: messageId,
      sender: req.user.userId
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or you are not the sender'
      });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add reaction to message
exports.addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;

    const message = await ChatMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Remove existing reaction from same user if any
    message.reactions = message.reactions.filter(r => !r.user.equals(req.user.userId));

    // Add new reaction
    message.reactions.push({
      user: req.user.userId,
      emoji
    });

    await message.save();
    await message.populate('reactions.user', 'name email');

    res.json({
      success: true,
      message: 'Reaction added successfully',
      data: message
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 