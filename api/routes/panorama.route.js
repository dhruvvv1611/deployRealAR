import express from "express";
import { getPanoramicImagesByPostId } from "../controllers/panoramic.controller.js";

const router = express.Router();

// Define a route to get panoramic images for a specific post ID
router.get("/:id/images", getPanoramicImagesByPostId);

export default router;
