// import { Server } from "socket.io";

// export default function SocketHandler(req, res) {
//   if (!res.socket.server.io) {
//     const io = new Server(res.socket.server);

//     io.on("connection", (socket) => {
//       console.log("User Connected:", socket.id);

//       socket.on("joinRoom", (roomId) => {
//         socket.join(roomId);
//       });

//       socket.on("sendMessage", ({ roomId, message }) => {
//         io.to(roomId).emit("receiveMessage", message);
//       });

//       socket.on("disconnect", () => {
//         console.log("User Disconnected:", socket.id);
//       });
//     });

//     res.socket.server.io = io;
//   }
//   res.end();
// }
