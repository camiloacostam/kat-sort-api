// routes/solutionRoutes.js
import express from "express";
import { startTest } from "../controllers/solution.js";

const router = express.Router();

router.post("/start", startTest);
// router.put("/complete", completeTest);

export default router;
