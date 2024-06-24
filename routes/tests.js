import express from "express";
import { createTest, getUserTests } from "../controllers/tests.js";
import authMiddleware from "../middleware/auth.js"; // Middleware para verificar el token y añadir req.user

const router = express.Router();

router.post("/create", createTest);
router.get("/tests/:userId", getUserTests);

export default router;
