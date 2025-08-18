import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireOwnership } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get user bookings
router.get('/', authenticateToken, [
  query('status').optional().isIn(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      status,
      page = 1,
      limit = 10
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      userId: req.user.id,
      ...(status && { status })
    };

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
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
          },
          payment: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.booking.count({ where })
    ]);

    res.json({
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single booking
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        boat: {
          include: {
            location: true,
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                email: true,
                phone: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true,
            phone: true
          }
        },
        payment: true,
        review: true
      }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking or the boat
    if (booking.userId !== req.user.id && 
        booking.boat.ownerId !== req.user.id && 
        req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create booking
router.post('/', authenticateToken, [
  body('boatId').isString(),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
  body('guestCount').isInt({ min: 1 }),
  body('totalPrice').isFloat({ min: 0 }),
  body('message').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { boatId, startDate, endDate, guestCount, totalPrice, message } = req.body;

    // Check if boat exists and is available
    const boat = await prisma.boat.findUnique({
      where: { id: boatId },
      include: { owner: true }
    });

    if (!boat) {
      return res.status(404).json({ message: 'Boat not found' });
    }

    if (!boat.isActive) {
      return res.status(400).json({ message: 'Boat is not available' });
    }

    if (guestCount > boat.capacity) {
      return res.status(400).json({ message: 'Too many guests for this boat' });
    }

    // Check for conflicting bookings
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        boatId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            AND: [
              { startDate: { lte: new Date(startDate) } },
              { endDate: { gte: new Date(startDate) } }
            ]
          },
          {
            AND: [
              { startDate: { lte: new Date(endDate) } },
              { endDate: { gte: new Date(endDate) } }
            ]
          },
          {
            AND: [
              { startDate: { gte: new Date(startDate) } },
              { endDate: { lte: new Date(endDate) } }
            ]
          }
        ]
      }
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Boat is not available for these dates' });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        boatId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        guestCount,
        totalPrice,
        deposit: boat.deposit,
        message,
        status: 'PENDING'
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

    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status
router.put('/:id/status', authenticateToken, [
  body('status').isIn(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { boat: true }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check permissions
    const canUpdate = booking.userId === req.user.id || 
                     booking.boat.ownerId === req.user.id || 
                     req.user.role === 'ADMIN';

    if (!canUpdate) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
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

    res.json(updatedBooking);
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.delete('/:id', authenticateToken, requireOwnership('booking'), async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update status to cancelled instead of deleting
    await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' }
    });

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;