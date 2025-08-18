import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

export const requireOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      let resource;

      switch (resourceType) {
        case 'boat':
          resource = await prisma.boat.findUnique({
            where: { id: resourceId },
            select: { ownerId: true }
          });
          break;
        case 'booking':
          resource = await prisma.booking.findUnique({
            where: { id: resourceId },
            select: { userId: true }
          });
          break;
        default:
          return res.status(400).json({ message: 'Invalid resource type' });
      }

      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      const ownerId = resource.ownerId || resource.userId;
      if (ownerId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
};