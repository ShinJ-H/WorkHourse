import express from "express";
import {
  adminLogin,
  updateAdminAvatar,
  updateAdminProfile
} from "../controllers/adminController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ✅ Only admin login route
router.post("/login", adminLogin);

// ✅ Update admin avatar
router.put(
  "/avatar/:id",
  upload.single("avatar"),
  updateAdminAvatar
);

router.put(
  "/profile/:id",
  updateAdminProfile
);

export default router;
