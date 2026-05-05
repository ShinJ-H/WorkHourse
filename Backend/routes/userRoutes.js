import express from "express";
import User from "../models/User.js";
import Task from "../models/Task.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* ================= EXISTING ================= */

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= NEW ================= */

// 👤 Get Profile + Task Stats
router.get("/profile", protect, async (req, res) => {
  try {
    const user = req.user;

    const total = await Task.countDocuments({ user: user._id });

    const completed = await Task.countDocuments({
      user: user._id,
      status: "Completed",
    });

    const pending = await Task.countDocuments({
      user: user._id,
      status: "Pending",
    });

    const inProgress = await Task.countDocuments({
      user: user._id,
      status: "In Progress",
    });

    // 🔥 NEW: Overdue logic using endDate
    const overdue = await Task.countDocuments({
      user: user._id,
      status: { $ne: "Completed" },
      endDate: { $lt: new Date() },
    });

    res.json({
      ...user._doc,
      stats: { total, completed, pending, inProgress },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✏️ Update Profile
router.put("/profile", protect, upload.single("image"), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // 🔥 ADD THESE
    if (req.body.darkMode !== undefined) {
      user.darkMode = req.body.darkMode === "true";
    }

    if (req.body.emailNotifications !== undefined) {
      user.emailNotifications = req.body.emailNotifications === "true";
    }

    if (req.body.reminders !== undefined) {
      user.reminders = req.body.reminders === "true";
    }

    // Avatar update (according to your schema)
    if (req.file) {
      user.avatar = {
        url: req.file.filename,
      };
    }

    const updatedUser = await user.save();
    res.json(updatedUser);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;