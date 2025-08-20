import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./db.js";

import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import boatsRoutes from "./routes/boats.js";
import bookingsRoutes from "./routes/bookings.js";
import paymentsRoutes from "./routes/payments.js";


const app = express();
const PORT = process.env.PORT || 5000;

// Connexion à MongoDB Atlas
connectDB();

// Middlewares
app.use(express.json());

// CORS configuré pour ton front
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000/",
    credentials: true
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/boats", boatsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/payments", paymentsRoutes);

// Route non trouvée
app.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// Middleware global de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erreur serveur" });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log('🚀 Serveur démarré sur http://localhost:${PORT}');
});