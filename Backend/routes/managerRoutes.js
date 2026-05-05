import express from "express";
import { managerLogin } from "../controllers/managerController.js";

const router = express.Router();

// ✅ Only manager login
router.post("/login", managerLogin);

export default router;