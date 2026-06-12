import Manager from "../models/Manager.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id, role: "manager" }, process.env.JWT_SECRET, {
    expiresIn: "7y"
  });
};

export const managerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 Check ONLY in Manager collection
    const manager = await Manager.findOne({ email });

    if (!manager) {
      return res.status(401).json({
        message: "Access denied: Not a manager"
      });
    }

    // Check password
    const isMatch = await manager.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    res.status(200).json({
      message: "Manager login successful",
      manager,
      token: generateToken(manager._id)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};