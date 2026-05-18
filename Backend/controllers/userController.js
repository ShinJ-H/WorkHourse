import User from "../models/User.js";
import Task from "../models/Task.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= REGISTER =================

export const getAllUsers = async (req, res) => {
   try {
      const users = await User.find()

      res.status(200).json(users);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// ================= CHANGE ROLE =================

export const changeRole = async (req, res) => {

   try {

      const { role } = req.body;

      const user = await User.findByIdAndUpdate(
         req.params.id,
         { role },
         { returnDocument: "after" }
      );

      res.status(200).json(user);

   }
   catch (error) {

      res.status(500).json({
         message: error.message,
      });

   }

};

export const updateUser = async (req, res) => {

   try {

      const { name, email, role } = req.body;

      const user = await User.findByIdAndUpdate(
         req.params.id,
         {
            name,
            email,
            role,
         },
         { returnDocument: "after" }
      );

      res.status(200).json(user);

   }
   catch (error) {

      res.status(500).json({
         message: error.message,
      });

   }

};