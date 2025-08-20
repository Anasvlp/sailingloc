import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import connectDB from './db.js';
 
//console log test beug connect bdd
console.log("DEBUG MONGO_URI =", process.env.MONGO_URI);
 
// Routes
import authRoutes from './routes/auth.js';
import boatRoutes from './routes/boats.js';
import bookingRoutes from './routes/bookings.js';
import userRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';
import paymentRoutes from './routes/payments.js';
 
connectDB(); // <-- ajouté ici
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
const app = express();
const PORT = process.env.PORT || 5000;
 
// Security middleware
app.use(helmet());
 
// CORS
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim());
 
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);
 
// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
 
// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
 
// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/boats', boatRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
 
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
 
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});
 
// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
 
app.listen(PORT, () => {
  console.log(`🚢 SailingLoc server running on port ${PORT}`);
});