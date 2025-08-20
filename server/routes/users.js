import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('id email firstName lastName role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('firstName').optional().trim().isLength({ min: 1 }),
  body('lastName').optional().trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const allowedFields = ['firstName', 'lastName'];
    const updateData = Object.fromEntries(
      Object.entries(req.body).filter(([k]) => allowedFields.includes(k))
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select('id email firstName lastName role');

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user favorites
router.get('/favorites', authenticateToken, async (req, res) => {
  res.json([]);
});

// Add to favorites
router.post('/favorites', authenticateToken, [body('boatId').isString()], async (req, res) => {
  res.status(501).json({ message: 'Favorites not implemented' });
});

// Remove from favorites
router.delete('/favorites/:boatId', authenticateToken, async (req, res) => {
  res.json({ message: 'Favorites not implemented' });
});

// Get user messages
router.get('/messages', authenticateToken, async (req, res) => {
  res.json([]);
});

// Send message
router.post('/messages', authenticateToken, [
  body('receiverId').isString(),
  body('content').trim().isLength({ min: 1, max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { receiverId, content } = req.body;
    const receiver = await User.findById(receiverId).select('id');
    if (!receiver) return res.status(404).json({ message: 'Receiver not found' });

    res.status(201).json({ id: 'pending', senderId: req.user.id, receiverId, content });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark message as read
router.put('/messages/:id/read', authenticateToken, async (req, res) => {
  res.json({ message: 'Not implemented' });
});

export default router;