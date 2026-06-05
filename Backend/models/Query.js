import mongoose from "mongoose";

const querySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    project: { type: String, default: "" },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Query", querySchema);

