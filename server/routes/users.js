import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            boats: true,
            bookings: true,
            reviews: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('firstName').optional().trim().isLength({ min: 1 }),
  body('lastName').optional().trim().isLength({ min: 1 }),
  body('phone').optional().isMobilePhone(),
  body('avatar').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = {};
    const allowedFields = ['firstName', 'lastName', 'phone', 'avatar'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isVerified: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user favorites
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: {
        boat: {
          include: {
            location: true,
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            },
            reviews: {
              select: { rating: true }
            },
            _count: {
              select: { reviews: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate average ratings
    const favoritesWithRatings = favorites.map(favorite => {
      const avgRating = favorite.boat.reviews.length > 0
        ? favorite.boat.reviews.reduce((sum, review) => sum + review.rating, 0) / favorite.boat.reviews.length
        : 0;
      
      const { reviews, ...boatData } = favorite.boat;
      return {
        ...favorite,
        boat: {
          ...boatData,
          avgRating: Math.round(avgRating * 10) / 10,
          reviewCount: favorite.boat._count.reviews
        }
      };
    });

    res.json(favoritesWithRatings);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to favorites
router.post('/favorites', authenticateToken, [
  body('boatId').isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { boatId } = req.body;

    // Check if boat exists
    const boat = await prisma.boat.findUnique({
      where: { id: boatId }
    });

    if (!boat) {
      return res.status(404).json({ message: 'Boat not found' });
    }

    // Check if already in favorites
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_boatId: {
          userId: req.user.id,
          boatId
        }
      }
    });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Boat already in favorites' });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: req.user.id,
        boatId
      },
      include: {
        boat: {
          include: {
            location: true,
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    res.status(201).json(favorite);
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from favorites
router.delete('/favorites/:boatId', authenticateToken, async (req, res) => {
  try {
    const { boatId } = req.params;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_boatId: {
          userId: req.user.id,
          boatId
        }
      }
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    await prisma.favorite.delete({
      where: {
        userId_boatId: {
          userId: req.user.id,
          boatId
        }
      }
    });

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user messages
router.get('/messages', authenticateToken, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id },
          { receiverId: req.user.id }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/messages', authenticateToken, [
  body('receiverId').isString(),
  body('content').trim().isLength({ min: 1, max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { receiverId, content } = req.body;

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    });

    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const message = await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId,
        content
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark message as read
router.put('/messages/:id/read', authenticateToken, async (req, res) => {
  try {
    const message = await prisma.message.findUnique({
      where: { id: req.params.id }
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.receiverId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedMessage = await prisma.message.update({
      where: { id: req.params.id },
      data: { isRead: true }
    });

    res.json(updatedMessage);
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;