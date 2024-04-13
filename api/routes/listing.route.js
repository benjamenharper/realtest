import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Route to create a new listing
router.post("/create", verifyToken, createListing);

// Route to delete a listing
router.delete("/delete/:id", verifyToken, deleteListing);

// Route to update an existing listing
router.post("/update/:id", verifyToken, updateListing);

// Route to get a single listing by ID
router.get("/get/:id", getListing);

// Route to get all listings
router.get("/get", getListings);

export default router;
