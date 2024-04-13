import express from "express";
import {
  google,
  signIn,
  signOut,
  signUp,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Route to handle user sign up
router.post("/signUp", signUp);

// Route to handle user sign in
router.post("/signIn", signIn);

// Route to handle Google sign in
router.post("/google", google);

// Route to handle user sign out
router.get("/signOut", signOut);

export default router;
