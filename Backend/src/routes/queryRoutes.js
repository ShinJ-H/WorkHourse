import express from "express";
import {
  createQuery,
  getQueries,
  deleteQuery,
} from "../controllers/queryController.js";

const router = express.Router();

router.post("/", createQuery);
router.get("/", getQueries);
router.delete("/:id", deleteQuery);

export default router;

