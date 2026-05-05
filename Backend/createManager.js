// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Manager from "./models/Manager.js";

// dotenv.config();

// const run = async () => {
//   await mongoose.connect(process.env.MONGO_URI);

//   await Manager.create({
//     email: "manager@gmail.com",
//     password: "manager1"
//   });

//   console.log("Manager created");
//   process.exit();
// };

// run();

import mongoose from "mongoose";
import dotenv from "dotenv";
import Manager from "./models/Manager.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Manager.create({
    email: "manager1@gmail.com",
    password: "manager1"
  });

  await Manager.create({
    email: "manager2@gmail.com",
    password: "manager2"
  });

   await Manager.create({
    email: "manager3@gmail.com",
    password: "manager3"
  });

   await Manager.create({
    email: "manager4@gmail.com",
    password: "manager4"
  });

   await Manager.create({
    email: "manager5@gmail.com",
    password: "manager5"
  });

   await Manager.create({
    email: "manager6@gmail.com",
    password: "manager6"
  });

   await Manager.create({
    email: "manager7@gmail.com",
    password: "manager7"
  });

  console.log("Managers created");
  process.exit();
};

run();