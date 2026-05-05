import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed",],
      default: "Pending"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    file: {
      url: String,
      public_id: String
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;