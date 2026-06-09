import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "7y"
  });
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 Check ONLY in Admin collection
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        message: "Access denied: Not an admin"
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    res.status(200).json({
      message: "Admin login successful",
      admin,
      token: generateToken(admin._id)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE ADMIN AVATAR =================

export const updateAdminAvatar = async (req, res) => {
  try {
    const { name, email } = req.body;

    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    admin.name = name || admin.name;
    admin.email = email || admin.email;

    const updatedAdmin = await admin.save();

    res.status(200).json(updatedAdmin);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    admin.name = name;
    admin.email = email;

    await admin.save();

    res.status(200).json(admin);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};