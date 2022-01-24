const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("user-active", (activeUser) => {
    let chatRoomId = activeUser.chatRoomId;
    socket.join(chatRoomId);
    socket.broadcast.to(chatRoomId).emit("user-online", {
      activeUserId: activeUser.userId,
      socketId: socket.id,
    });
  });

  socket.on("user-deactive", (userData) => {
    let chatRoomId = userData.chatRoomId;
    socket.broadcast.to(chatRoomId).emit("user-offline", userData.userId);
    socket.leave(chatRoomId);
  });

  socket.on("existing-user", (data) => {
    socket.broadcast
      .to(data.newUserSocketId)
      .emit("show-existing-user", data.existingUserId);
  });

  socket.on("chat-message", (chat) => {
    socket.broadcast.to(chat.chatroom_id).emit("receive-message", chat);
  });
  socket.on("chat-delete", ({ chatroomId, chatId }) => {
    socket.broadcast.to(chatroomId).emit("to-delete-chat", chatId);
  });
  socket.on("user-ban", ({ id, room }) => {
    socket.broadcast.to(room).emit("ban-user", id);
  });
  socket.on("make-admin", ({ id, room }) => {
    socket.broadcast.to(room).emit("admin-popup", id);
  });
});

http.listen(4000, () => {
  console.log("listening on port: ", 4000);
});
