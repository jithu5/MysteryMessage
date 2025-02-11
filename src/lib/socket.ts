const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("joinRoom", (chatId) => {
            socket.join(chatId);
        });

        socket.on("sendMessage", (message) => {
            io.to(message.chatId).emit("message", message); // Send only to chat room
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};

module.exports = { initializeSocket, getIo: () => io };
