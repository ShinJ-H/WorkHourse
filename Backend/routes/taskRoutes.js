import express from "express";
import { createTask, getTasks } from "../controllers/taskController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/create", upload.single("file"), createTask);

router.get("/", getTasks);

export default router;