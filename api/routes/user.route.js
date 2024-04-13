import express from "express";
import {
  deleteUser,
  getUserListings,
  updateUser,
  getUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Route to update user profile
router.post("/update/:id", verifyToken, updateUser);

// Route to delete user account
router.delete("/delete/:id", verifyToken, deleteUser);

// Route to get listings associated with a user
router.get("/listings/:id", verifyToken, getUserListings);

// Route to get user profile information
router.get("/:id", verifyToken, getUser);

export default router;
