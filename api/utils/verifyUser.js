import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

// Middleware function to verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  // If token is not present, return a 401 Unauthorized error using the errorHandler function
  if (!token) return next(errorHandler(401, "you are not authorized"));

  // Verify the token using jwt.verify method
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(403, "Forbidden"));
    }
    // If verification is successful, attach the user object to the request
    req.user = user;
    next();
  });
};
