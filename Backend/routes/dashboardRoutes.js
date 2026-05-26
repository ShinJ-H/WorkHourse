import express from "express";
import {
  getDashboardStats,
  getProjectStatusStats,
  getTaskStatusStats,
} from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin Dashboard Stats
router.get("/stats", getDashboardStats);

// ✅ Status counts for admin/manager dashboards based on logged-in user
router.get("/task-status", protect, getTaskStatusStats);
router.get("/project-status", protect, getProjectStatusStats);

export default router;

