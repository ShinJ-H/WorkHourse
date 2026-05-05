import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Admin.create({
    email: "admin@gmail.com",
    password: "123456"
  });

  console.log("Admin created");
  process.exit();
};

run();