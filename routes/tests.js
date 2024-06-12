import express from "express";
import { createTest } from "../controllers/tests.js";
import authMiddleware from "../middlewares/auth.js"; // Middleware para verificar el token y añadir req.user

const router = express.Router();

router.post("/create", authMiddleware, createTest);

export default router;
