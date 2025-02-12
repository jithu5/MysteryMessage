const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Enable CORS for frontend connection
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Update with your frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log(`🔗 Client connected: ${socket.id}`);

  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

socket.on("sendMessage", (data) => {
  const { roomId, sender, content, reciever ,createdAt} = data;

  // Emit with the correct event name
  io.to(roomId).emit("receiveMessage", { sender, content, reciever,createdAt });
});

  socket.on("disconnect", () => {
    console.log(`🚪 Client disconnected: ${socket.id}`);
  });
});

server.listen(5000, () =>
  console.log("🚀 WebSocket Server running on port 5000")
);
