import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

// Controller function to update user profile
export const updateUser = async (req, res, next) => {
  // Check if the authenticated user is the same as the user being updated
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));
  try {
    if (req.body.password) {
      // If password is provided, hash it
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // Update user information in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    // Exclude password field from user data
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Controller function to delete user account
export const deleteUser = async (req, res, next) => {
  // Check if the authenticated user is the same as the user being deleted
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    // Delete user from the database
    await User.findByIdAndDelete(req.params.id);
    // Clear the access_token cookie
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};

// Controller function to get listings associated with a user
export const getUserListings = async (req, res, next) => {
  // Check if the authenticated user is the same as the user whose listings are being requested
  if (req.user.id === req.params.id) {
    try {
      // Find listings associated with the user
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};

// Controller function to get user profile information
export const getUser = async (req, res, next) => {
  try {
    // Find user by ID
    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, "User not found!"));

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
