import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";
import Message from "./models/Message.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const typingUsers = {};

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins
  socket.on("user_join", async ({ username, role }) => {
    let user = await User.findOne({ username });
    if (!user) user = await User.create({ username, role });

    socket.userId = user._id;
    socket.username = user.username;
    socket.role = user.role;

    const users = await User.find();
    io.emit("user_list", users);
    io.emit("user_joined", { username: socket.username, id: socket.id });
  });

  // Send message
  socket.on("send_message", async (data, callback) => {
    const messageData = {
      sender: socket.username,
      senderId: socket.id,
      message: data.message,
      isPrivate: data.isPrivate || false,
      to: data.to || null,
    };
    const message = await Message.create(messageData);

    if (message.isPrivate && message.to) {
      socket.to(message.to).emit("private_message", message);
      socket.emit("private_message", message);
    } else {
      io.emit("receive_message", message);
    }

    if (callback) callback({ status: "delivered", id: message._id });
  });

  // Typing indicator
  socket.on("typing", (isTyping) => {
    if (isTyping) typingUsers[socket.id] = socket.username;
    else delete typingUsers[socket.id];
    io.emit("typing_users", Object.values(typingUsers));
  });

  // Read receipt
  socket.on("message_read", async ({ messageId }) => {
    await Message.findByIdAndUpdate(messageId, {
      $addToSet: { readBy: socket.id },
    });
    io.emit("message_read", { messageId, readerId: socket.id });
  });

  // Disconnect
  socket.on("disconnect", () => {
    io.emit("user_left", { username: socket.username, id: socket.id });
    delete typingUsers[socket.id];
  });
});

// API endpoints
app.get("/api/messages", async (req, res) => {
  const messages = await Message.find().sort({ timestamp: 1 });
  res.json(messages);
});

app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.get("/", (req, res) => res.send("Socket.io Chat Server Running"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
