import express from "express";

import {
  createProject,
  getProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  getUserProjects,
} from "../controllers/projectController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/create", upload.array("files", 10), createProject);


router.get("/", getProjects);

// Optional endpoints (used by imports in routes/controller)
router.get("/:id", getSingleProject);

router.put("/:id", upload.array("files", 10), updateProject);


router.delete("/:id", deleteProject);

router.get("/user/:userId", getUserProjects);


export default router;