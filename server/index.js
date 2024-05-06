import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";



const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const userSocketMap = {};



function getAllConnectedClients(boardId) {
  return Array.from(io.sockets.adapter.rooms.get(boardId) || []).map(
    (socketId) => {
      return {
        socketId,
        userName: userSocketMap[socketId],
        imageUrl: userSocketMap[socketId]?.imageUrl, 
      };
    }
  );
}

io.on("connection", (socket) => {
  socket.on("join", ({ boardId, userName }) => {
    userSocketMap[socket.id] = userName;
    console.log('User joined:', userName, 'Socket ID:', socket.id);
    socket.join(boardId);

    const clients = getAllConnectedClients(boardId);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit('joined', {
        clients,
        userName,
        socketId: socket.id,
      });
    });
  });

  socket.on("board_change", ({ boardId, code }) => {
    socket.in(boardId).emit("board_change", { code });
  });

  socket.on("image_update", ({ boardId, imageUrl }) => {
    socket.in(boardId).emit("image_update", { imageUrl });
  });

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((boardId) => {
      socket.in(boardId).emit("disconnected", {
        socketId: socket.id,
        userName: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

httpServer.listen(54321, () => {
  console.log("server is running");
});
