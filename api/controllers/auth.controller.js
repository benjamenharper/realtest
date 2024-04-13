import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Controller function to handle user sign up
export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  // Hash the password
  const hashedPassword = bcryptjs.hashSync(password, 10);
  // Create a new user object with hashed password
  const newUser = new User({ username, email, password: hashedPassword });

  console.log(`req body from signup ${req.body.User}`);

  try {
    // Save the new user to the database
    await newUser.save();
    res.status(201).json("user created successfully!");
  } catch (error) {
    next(error);
  }
};

// Controller function to handle user sign in
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Find the user by email, If user not found, return error
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(404, "Invalid credentials!"));
    // Generate JWT token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    // Exclude password field from user data
    const { password: pass, ...rest } = validUser._doc;
    // Set cookie with JWT token and send user data in response
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Controller function to handle Google sign in
export const google = async (req, res, next) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // If user exists, generate JWT token and send user data in response
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
        })
        .status(200)
        .json(rest);
    } else {
      // If user does not exist, generate random password, hash it, and create a new user
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      // Generate JWT token and send user data in response
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;

      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

// Controller function to handle user sign out
export const signOut = async (req, res, next) => {
  try {
    // Clear the access_token cookie
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out");
  } catch (error) {
    next(error);
  }
};
