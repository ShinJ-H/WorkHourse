import express from "express";
import upload from "../middleware/upload.js";
import {
  createNote,
  getNotes,
  deleteNote,
  updateNote
} from "../controllers/noteController.js";

const router = express.Router();

router.post("/", upload.single("image"), createNote);
router.get("/", getNotes);
router.delete("/:id", deleteNote);
router.put("/:id", upload.single("image"), updateNote);

export default router;