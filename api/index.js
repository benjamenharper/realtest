import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";

// Connect to MongoDB
mongoose
  .connect(process.env.MongoUrl)
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

const app = express();

app.use(
  cors({
    origin: `https://real-estate-web-app-client.vercel.app`,
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());
// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// Start the server
app.listen(3005, () => {
  console.log("Server is running on port 3005");
});

// Define routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
