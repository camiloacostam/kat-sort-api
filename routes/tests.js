import express from "express";
import {
  createTest,
  getUserTests,
  getTestByAccessLink,
  getTestDetails,
} from "../controllers/tests.js";

const router = express.Router();

router.post("/create", createTest);
router.get("/:userId", getUserTests);
router.get("/solve/:accessLink", getTestByAccessLink);
router.get("/details/:testId", getTestDetails);

export default router;
