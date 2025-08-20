// server/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
 
const JWT_SECRET = process.env.JWT_SECRET || "secret";
 
// ==================== AUTHENTICATE TOKEN ====================
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // format: Bearer <token>
 
  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }
 
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
 
    // Sélectionne seulement les champs utiles de l'utilisateur
    const user = await User.findById(decoded.id).select("id firstName lastName email role");
 
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
 
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
 
// ==================== REQUIRE ROLE ====================
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
 
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
 
    next();
  };
};
 
// ==================== REQUIRE OWNERSHIP ====================
export const requireOwnership = (resourceType, Model) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const resource = await Model.findById(resourceId);
 
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
 
      let ownerId;
      switch (resourceType) {
        case "boat":
          ownerId = resource.ownerId?.toString();
          break;
        case "booking":
          ownerId = resource.userId?.toString();
          break;
        default:
          return res.status(400).json({ message: "Invalid resource type" });
      }
 
      // Vérifie que l’utilisateur est le propriétaire OU un ADMIN
      if (ownerId !== req.user.id.toString() && req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Access denied" });
      }
 
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
};
 
// ==================== AUTHORIZE ADMIN (shortcut) ====================
export const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Accès interdit, réservé aux admins" });
  }
  next();
};
 