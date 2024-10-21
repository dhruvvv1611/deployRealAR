import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http"; // Import http for socket.io and express integration
import { Server } from "socket.io"; // Import socket.io server
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import modelsRoute from "./routes/model.route.js";
import panoramicRoute from "./routes/panorama.route.js";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Initialize express app
const app = express();

// Middleware setup
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); // CORS settings
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// Route setup
app.use("/api/auth", authRoute); // Authentication routes
app.use("/api/users", userRoute); // User management routes
app.use("/api/posts", postRoute); // Post management routes
app.use("/api/test", testRoute); // Test routes
app.use("/api/chats", chatRoute); // Chat functionality
app.use("/api/messages", messageRoute); // Message functionality
app.use("/api/models", modelsRoute); // 3D model routes
app.use("/api/panoramic", panoramicRoute); // Panoramic routes

// Create an HTTP server to use with both Express and Socket.io
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your client URL
  },
});

let onlineUser = [];

// Manage users for socket.io
const addUser = (userId, socketId) => {
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle new user event
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log("User added:", userId, socket.id);
  });

  // Handle send message event
  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    }
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("User disconnected:", socket.id);
  });
});

// Serve static files from the client build directory
// Serve static files from the client build directory
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
});


// Start the server
server.listen(8800, () => {
  console.log("Server is running on port 8800!");
});
