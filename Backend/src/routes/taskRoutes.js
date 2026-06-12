import express from "express";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/taskController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/create", upload.single("file"), createTask);

router.get("/", getTasks);

// ✅ Fix for frontend PUT /api/tasks/:id
router.put("/:id", upload.single("file"), updateTask);

// ✅ Fix for frontend DELETE /api/tasks/:id
router.delete("/:id", deleteTask);

export default router;
