import express from "express";
import User from "../models/User.js";
import Task from "../models/Task.js";

import { protect } from "../middleware/authMiddleware.js";

import upload from "../middleware/upload.js";

// ✅ IMPORT LOGIN/REGISTER FROM authController
import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";

// ✅ IMPORT OTHER FUNCTIONS FROM userController
import {
  getAllUsers,
  changeRole,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

/* ================= AUTH ================= */

// Register
router.post("/register", upload.single("image"), registerUser);

// Login
router.post("/login", loginUser);

/* ================= ADMIN ================= */

// Change Role
router.put("/changerole/:id", changeRole);

// Update User
router.put("/update/:id", updateUser);

/* ================= USERS ================= */

// Get all users
router.get("/", getAllUsers);

// Delete user
router.delete("/:id", async (req, res) => {
  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});

/* ================= PROFILE ================= */

// Get Profile + Stats
router.get("/profile", protect, async (req, res) => {
  try {

    const user = req.user;

    // Total tasks
    const total = await Task.countDocuments({
      user: user._id,
    });

    // Completed
    const completed = await Task.countDocuments({
      user: user._id,
      status: "Completed",
    });

    // Pending
    const pending = await Task.countDocuments({
      user: user._id,
      status: "Pending",
    });

    // In Progress
    const inProgress = await Task.countDocuments({
      user: user._id,
      status: "In Progress",
    });

    // Overdue
    const overdue = await Task.countDocuments({
      user: user._id,
      status: { $ne: "Completed" },
      endDate: { $lt: new Date() },
    });

    // Response
    res.json({
      ...user._doc,

      stats: {
        total,
        completed,
        pending,
        inProgress,
        overdue,
      },
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});

/* ================= UPDATE PROFILE ================= */

router.put(
  "/profile",
  protect,
  upload.single("image"),
  async (req, res) => {

    try {

      const user = await User.findById(
        req.user._id
      );

      // Update name/email
      user.name =
        req.body.name || user.name;

      user.email =
        req.body.email || user.email;

      // Dark mode
      if (
        req.body.darkMode !== undefined
      ) {
        user.darkMode =
          req.body.darkMode === "true";
      }

      // Email notifications
      if (
        req.body.emailNotifications !== undefined
      ) {
        user.emailNotifications =
          req.body.emailNotifications === "true";
      }

      // Reminders
      if (
        req.body.reminders !== undefined
      ) {
        user.reminders =
          req.body.reminders === "true";
      }

      // Avatar upload
      if (req.file) {

        user.avatar = {
          url: req.file.filename,
          public_id: req.file.filename,
        };
      }

      // Save
      const updatedUser =
        await user.save();

      res.json(updatedUser);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

export default router;