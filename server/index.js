import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const userSocketMap = {};
const boardUsersMap = {};


function getAllConnectedClients(boardId) {
  const usernames = boardUsersMap[boardId] || [];
  return usernames.map(userName => ({
    socketId: userSocketMap[userName], 
    userName,
  }));
}

io.on("connection", (socket) => {
  socket.on("join", ({ boardId, userName }) => {
    if (boardUsersMap[boardId]?.includes(userName)) {
      return; 
    }

    userSocketMap[userName] = socket.id;
    boardUsersMap[boardId] = boardUsersMap[boardId] || [];
    boardUsersMap[boardId].push(userName);

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
     const userName = boardUsersMap[boardId]?.find(name => userSocketMap[name] === socket.id); 

      

      if(userName){
      socket.in(boardId).emit("disconnected", {
        socketId: socket.id,
        userName,
      });
      boardUsersMap[boardId] = boardUsersMap[boardId]?.filter(name => name !== userName);
      delete userSocketMap[userName]; 
    }
    });

    socket.leave();
  });
});

httpServer.listen(54321, () => {
  console.log("server is running");
});
