//projectRoutes.js

import express from "express";

import {
  createProject,
  getProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  getUserProjects,
  updateProjectMemberStatus,
} from "../controllers/projectController.js";

import upload from "../middleware/upload.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post(
  "/create",
  upload.array("files", 10),
  createProject
);

router.get("/", getProjects);

router.get("/:id", getSingleProject);

router.put(
  "/:id",
  upload.array("files", 10),
  updateProject
);

router.delete("/:id", deleteProject);

router.get(
  "/user/:userId",
  getUserProjects
);

// Inline protection (no separate protect.js file)
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

router.put(
  "/member-status/:id",
  protect,
  updateProjectMemberStatus
);

export default router;

