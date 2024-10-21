// routes/models.js
import express from "express";
import { getModelsByPostId } from "../controllers/model.controller.js";

const router = express.Router();

// Define a route to get models for a specific post ID
router.get("/:id/models", getModelsByPostId);

export default router;
