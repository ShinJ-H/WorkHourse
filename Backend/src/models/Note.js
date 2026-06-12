import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String, // store image path
}, { timestamps: true });

export default mongoose.model("Note", noteSchema);