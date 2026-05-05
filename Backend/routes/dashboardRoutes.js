import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

// Admin Dashboard Stats
router.get("/stats", getDashboardStats);

export default router;