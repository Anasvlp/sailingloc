import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole, requireOwnership } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all boats with filters
router.get('/', [
  query('category').optional().isIn(['SAILBOAT', 'CATAMARAN', 'MOTORBOAT', 'RIB']),
  query('type').optional().isIn(['MONOHULL', 'MULTIHULL']),
  query('location').optional().isString(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('capacity').optional().isInt({ min: 1 }),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('sortBy').optional().isIn(['price', 'rating', 'recent', 'popular']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      category,
      type,
      location,
      minPrice,
      maxPrice,
      capacity,
      startDate,
      endDate,
      sortBy = 'recent',
      page = 1,
      limit = 12
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {
      isActive: true,
      ...(category && { category }),
      ...(type && { type }),
      ...(capacity && { capacity: { gte: parseInt(capacity) } }),
      ...(minPrice && { pricePerDay: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { pricePerDay: { lte: parseFloat(maxPrice) } }),
      ...(location && {
        location: {
          name: { contains: location, mode: 'insensitive' }
        }
      })
    };

    // Handle date availability filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      where.NOT = {
        bookings: {
          some: {
            OR: [
              {
                AND: [
                  { startDate: { lte: start } },
                  { endDate: { gte: start } }
                ]
              },
              {
                AND: [
                  { startDate: { lte: end } },
                  { endDate: { gte: end } }
                ]
              },
              {
                AND: [
                  { startDate: { gte: start } },
                  { endDate: { lte: end } }
                ]
              }
            ],
            status: { in: ['PENDING', 'CONFIRMED'] }
          }
        }
      };
    }

    // Build orderBy clause
    let orderBy = {};
    switch (sortBy) {
      case 'price':
        orderBy = { pricePerDay: 'asc' };
        break;
      case 'rating':
        orderBy = { reviews: { _count: 'desc' } };
        break;
      case 'popular':
        orderBy = { bookings: { _count: 'desc' } };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

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
              avatar: true
            }
          },
          reviews: {
            select: {
              rating: true
            }
          },
          _count: {
            select: {
              reviews: true,
              bookings: true
            }
          }
        },
        orderBy,
        skip,
        take: parseInt(limit)
      }),
      prisma.boat.count({ where })
    ]);

    // Calculate average ratings
    const boatsWithRatings = boats.map(boat => {
      const avgRating = boat.reviews.length > 0
        ? boat.reviews.reduce((sum, review) => sum + review.rating, 0) / boat.reviews.length
        : 0;
      
      const { reviews, ...boatData } = boat;
      return {
        ...boatData,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: boat._count.reviews
      };
    });

    res.json({
      boats: boatsWithRatings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get boats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single boat
router.get('/:id', async (req, res) => {
  try {
    const boat = await prisma.boat.findUnique({
      where: { id: req.params.id },
      include: {
        location: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            createdAt: true
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        availabilities: {
          where: {
            date: { gte: new Date() }
          },
          orderBy: { date: 'asc' }
        },
        _count: {
          select: {
            reviews: true,
            bookings: true
          }
        }
      }
    });

    if (!boat) {
      return res.status(404).json({ message: 'Boat not found' });
    }

    // Calculate average ratings
    const avgRating = boat.reviews.length > 0
      ? boat.reviews.reduce((sum, review) => sum + review.rating, 0) / boat.reviews.length
      : 0;

    const avgRatings = {
      overall: Math.round(avgRating * 10) / 10,
      cleanliness: boat.reviews.length > 0 
        ? Math.round((boat.reviews.reduce((sum, r) => sum + r.cleanliness, 0) / boat.reviews.length) * 10) / 10 
        : 0,
      accuracy: boat.reviews.length > 0 
        ? Math.round((boat.reviews.reduce((sum, r) => sum + r.accuracy, 0) / boat.reviews.length) * 10) / 10 
        : 0,
      communication: boat.reviews.length > 0 
        ? Math.round((boat.reviews.reduce((sum, r) => sum + r.communication, 0) / boat.reviews.length) * 10) / 10 
        : 0,
      location: boat.reviews.length > 0 
        ? Math.round((boat.reviews.reduce((sum, r) => sum + r.location, 0) / boat.reviews.length) * 10) / 10 
        : 0,
      value: boat.reviews.length > 0 
        ? Math.round((boat.reviews.reduce((sum, r) => sum + r.value, 0) / boat.reviews.length) * 10) / 10 
        : 0
    };

    res.json({
      ...boat,
      avgRatings,
      reviewCount: boat._count.reviews
    });
  } catch (error) {
    console.error('Get boat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create boat (sellers only)
router.post('/', authenticateToken, requireRole(['SELLER', 'ADMIN']), [
  body('title').trim().isLength({ min: 1, max: 100 }),
  body('description').trim().isLength({ min: 10, max: 2000 }),
  body('category').isIn(['SAILBOAT', 'CATAMARAN', 'MOTORBOAT', 'RIB']),
  body('type').isIn(['MONOHULL', 'MULTIHULL']),
  body('brand').trim().isLength({ min: 1 }),
  body('model').trim().isLength({ min: 1 }),
  body('year').isInt({ min: 1950, max: new Date().getFullYear() + 1 }),
  body('length').isFloat({ min: 1, max: 100 }),
  body('capacity').isInt({ min: 1, max: 50 }),
  body('pricePerDay').isFloat({ min: 1 }),
  body('deposit').isFloat({ min: 0 }),
  body('locationId').isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const boatData = {
      ...req.body,
      ownerId: req.user.id,
      images: req.body.images || [],
      equipment: req.body.equipment || [],
      rules: req.body.rules || []
    };

    const boat = await prisma.boat.create({
      data: boatData,
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
    });

    res.status(201).json(boat);
  } catch (error) {
    console.error('Create boat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update boat
router.put('/:id', authenticateToken, requireOwnership('boat'), [
  body('title').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ min: 10, max: 2000 }),
  body('pricePerDay').optional().isFloat({ min: 1 }),
  body('deposit').optional().isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const boat = await prisma.boat.update({
      where: { id: req.params.id },
      data: req.body,
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
    });

    res.json(boat);
  } catch (error) {
    console.error('Update boat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete boat
router.delete('/:id', authenticateToken, requireOwnership('boat'), async (req, res) => {
  try {
    await prisma.boat.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Boat deleted successfully' });
  } catch (error) {
    console.error('Delete boat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get locations
router.get('/locations/all', async (req, res) => {
  try {
    const locations = await prisma.location.findMany({
      include: {
        _count: {
          select: {
            boats: {
              where: { isActive: true }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(locations);
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;