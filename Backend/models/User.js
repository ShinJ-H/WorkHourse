import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["Admin", "Manager", "User"],
      default: "User",
    },
    avatar: {
      url: String,
      public_id: String
    },
    // 🔥 ADD BELOW YOUR EXISTING FIELDS
    darkMode: { type: Boolean, default: false },
    emailNotifications: { type: Boolean, default: true },
    reminders: { type: Boolean, default: true },
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;