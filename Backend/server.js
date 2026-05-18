import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./Config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import managerRoutes from "./routes/managerRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import path from "path";
import fs from "fs";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
connectDB();

const app = express();

// Middleware
/* ---------------- CORS FIX (IMPORTANT) ---------------- */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

let users = {};

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  // USER JOIN
  socket.on("join", (userId) => {

    users[userId] = socket.id;

    // SEND ONLINE USERS TO EVERYONE
    io.emit(
      "onlineUsers",
      Object.keys(users)
    );
  });

  // SEND MESSAGE
  socket.on(
    "sendMessage",
    ({ senderId, receiverId, message }) => {

      const receiverSocket =
        users[receiverId];

      if (receiverSocket) {

        io.to(receiverSocket).emit(
          "receiveMessage",
          {
            senderId,
            receiverId,
            message,
          }
        );
      }
    }
  );

  // TYPING
  socket.on(
    "typing",
    ({ senderId, receiverId }) => {

      const receiverSocket =
        users[receiverId];

      if (receiverSocket) {

        io.to(receiverSocket).emit(
          "typing",
          senderId
        );
      }
    }
  );

  // DISCONNECT
  socket.on("disconnect", () => {

    for (let userId in users) {

      if (users[userId] === socket.id) {

        delete users[userId];

        break;
      }
    }

    // UPDATE ONLINE USERS
    io.emit(
      "onlineUsers",
      Object.keys(users)
    );

    console.log("User disconnected");
  });
});


app.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(
    process.cwd(),
    "uploads",
    req.params.filename
  );

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({
      message: "File not found",
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/projects", projectRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});