import jwt from "jsonwebtoken";
import User from "../models/User.js";

// verify token
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 FIX: fetch full user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // ✅ now full user object

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};