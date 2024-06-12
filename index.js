import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
// Routes imports
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import testRoutes from "./routes/tests.js";
// Middleware
import { corsMiddleware } from "./middleware/cors.js";

dotenv.config();

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(corsMiddleware());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
