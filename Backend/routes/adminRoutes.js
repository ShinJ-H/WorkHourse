import express from "express";
import { adminLogin } from "../controllers/adminController.js";

const router = express.Router();

// ✅ Only admin login route
router.post("/login", adminLogin);

export default router;