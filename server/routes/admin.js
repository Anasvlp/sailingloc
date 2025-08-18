import express from 'express';
import { query, body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// All admin routes require ADMIN role
router.use(authenticateToken, requireRole(['ADMIN']));

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalBoats,
      totalBookings,
      totalRevenue,
      recentBookings,
      popularDestinations
    ] = await Promise.all([
      prisma.user.count(),
      prisma.boat.count({ where: { isActive: true } }),
      prisma.booking.count(),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true }
      }),
      prisma.booking.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      }),
      prisma.location.findMany({
        include: {
          _count: {
            select: {
              boats: {
                where: { isActive: true }
              }
            }
          }
        },
        orderBy: {
          boats: {
            _count: 'desc'
          }
        },
        take: 5
      })
    ]);

    res.json({
      users: totalUsers,
      boats: totalBoats,
      bookings: totalBookings,
      revenue: totalRevenue._sum.amount || 0,
      recentBookings,
      popularDestinations
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role').optional().isIn(['USER', 'SELLER', 'ADMIN']),
  query('search').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 20,
      role,
      search
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      ...(role && { role }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
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
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/users/:id', [
  body('role').optional().isIn(['USER', 'SELLER', 'ADMIN']),
  body('isVerified').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = {};

    if (req.body.role !== undefined) updateData.role = req.body.role;
    if (req.body.isVerified !== undefined) updateData.isVerified = req.body.isVerified;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        createdAt: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Don't allow deleting the current admin
    if (id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all boats
router.get('/boats', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['active', 'inactive']),
  query('search').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 20,
      status,
      search
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      ...(status && { isActive: status === 'active' }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { brand: { contains: search, mode: 'insensitive' } },
          { model: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [boats, total] = await Promise.all([
      prisma.boat.findMany({
        where,
        include: {
          location: true,
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          _count: {
            select: {
              bookings: true,
              reviews: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.boat.count({ where })
    ]);

    res.json({
      boats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get admin boats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Moderate boat (activate/deactivate)
router.post('/boats/:id/moderate', [
  body('action').isIn(['activate', 'deactivate'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { action } = req.body;

    const boat = await prisma.boat.update({
      where: { id },
      data: { isActive: action === 'activate' },
      include: {
        location: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json(boat);
  } catch (error) {
    console.error('Moderate boat error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Boat not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings
router.get('/bookings', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 20,
      status
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      ...(status && { status })
    };

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          boat: {
            include: {
              location: true,
              owner: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true
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
    console.error('Get admin bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all reviews
router.get('/reviews', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 20
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          boat: {
            select: {
              id: true,
              title: true,
              owner: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.review.count()
    ]);

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get admin reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Moderate review (delete)
router.post('/reviews/:id/moderate', [
  body('action').isIn(['delete'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { action } = req.body;

    if (action === 'delete') {
      await prisma.review.delete({
        where: { id }
      });
      res.json({ message: 'Review deleted successfully' });
    }
  } catch (error) {
    console.error('Moderate review error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;